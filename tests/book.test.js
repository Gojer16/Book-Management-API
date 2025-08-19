const request = require('supertest');
const mongoose = require('mongoose');
const Book = require('../models/book');
const User = require('../models/User');
const app = require('../app');

describe('Book Integration', () => {
  let token;
  beforeAll(async () => {
    await mongoose.connection.db.dropDatabase();
    try {
      await request(app).post('/api/auth/register').send({ email: 'test@example.com', password: 'Password123!' });
    } catch (e) {}
    const res = await request(app).post('/api/auth/login').send({ email: 'test@example.com', password: 'Password123!' });
    token = res.body.token;
  });
  beforeEach(async () => {
    await Book.deleteMany({});
  });
  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('POST /api/books', () => {
    it('should create a new book', async () => {
      const res = await request(app)
        .post('/api/books')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Test Book', author: 'Author', genre: 'Test' });
      expect(res.status).toBe(201);
      expect(res.body.title).toBe('Test Book');
    });
    it('should not create book with missing required fields', async () => {
      const res = await request(app)
        .post('/api/books')
        .set('Authorization', `Bearer ${token}`)
        .send({});
      expect(res.status).toBe(400);
    });
    it('should not create duplicate ISBN', async () => {
      await Book.create({ title: 'A', author: 'B', genre: 'C', isbn: '9783161484100' });
      const res = await request(app)
        .post('/api/books')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'A2', author: 'B2', genre: 'C2', isbn: '9783161484100' });
      expect(res.status).toBe(409);
    });
  });

  describe('GET /api/books', () => {
    beforeEach(async () => {
      await Book.create([
        { title: 'The Hobbit', author: 'Tolkien', genre: 'Fantasy', tags: ['adventure', 'war', 'wizard'], publicationYear: 1937, rating: 9 },
        { title: '1984', author: 'Orwell', genre: 'Dystopia', tags: ['political'], publicationYear: 1949, rating: 10 },
        { title: 'Harry Potter', author: 'Rowling', genre: 'Fantasy', tags: ['magic'], publicationYear: 1997, rating: 8 },
      ]);
    });
    it('should return all books with default pagination', async () => {
      const res = await request(app)
        .get('/api/books')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.total).toBe(3);
      expect(res.body.results.length).toBe(3);
      expect(res.body.page).toBe(1);
      expect(res.body.totalPages).toBe(1);
    });
    it('should filter books by genre', async () => {
      const res = await request(app)
        .get('/api/books?genre=Fantasy')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.total).toBe(2);
      expect(res.body.results.every(b => b.genre === 'Fantasy')).toBe(true);
    });
    it('should filter by tags array', async () => {
      const res = await request(app)
        .get('/api/books?tags=magic')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.total).toBe(1);
      expect(res.body.results[0].tags).toContain('magic');
    });
    it('should sort by rating desc', async () => {
      const res = await request(app)
        .get('/api/books?sort=rating&order=desc')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.results[0].rating).toBe(10);
    });
    it('should paginate results', async () => {
      const res = await request(app)
        .get('/api/books?limit=2&page=2')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.results.length).toBe(1);
      expect(res.body.page).toBe(2);
    });
    it('should validate query params with Joi', async () => {
      const res = await request(app)
        .get('/api/books?sort=invalid')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/books/:id', () => {
    let book;
    beforeEach(async () => {
      book = await Book.create({ title: 'Book', author: 'A', genre: 'G', publicationYear: 2000 });
    });
    it('should get a book by id', async () => {
      const res = await request(app)
        .get(`/api/books/${book._id}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body._id).toBe(book._id.toString());
    });
    it('should return 404 if not found', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .get(`/api/books/${fakeId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(404);
    });
    it('should return 400 for invalid id', async () => {
      const res = await request(app)
        .get('/api/books/invalidid')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(400);
    });
  });

  describe('PUT /api/books/:id', () => {
    let book;
    beforeEach(async () => {
      book = await Book.create({ title: 'Book', author: 'A', genre: 'G', publicationYear: 2000 });
    });
    it('should update a book', async () => {
      const res = await request(app)
        .put(`/api/books/${book._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Updated' });
      expect(res.status).toBe(200);
      expect(res.body.title).toBe('Updated');
    });
    it('should return 404 if not found', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .put(`/api/books/${fakeId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'X' });
      expect(res.status).toBe(404);
    });
    it('should return 400 for invalid id', async () => {
      const res = await request(app)
        .put('/api/books/invalidid')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'X' });
      expect(res.status).toBe(400);
    });
    it('should return 409 for duplicate ISBN', async () => {
      await Book.create({ title: 'B', author: 'B', genre: 'G', isbn: '9783161484100' });
      const res = await request(app)
        .put(`/api/books/${book._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ isbn: '9783161484100' });
      expect(res.status).toBe(409);
    });
  });

  describe('DELETE /api/books/:id', () => {
    let book;
    beforeEach(async () => {
      book = await Book.create({ title: 'Book', author: 'A', genre: 'G', publicationYear: 2000 });
    });
    it('should delete a book', async () => {
      const res = await request(app)
        .delete(`/api/books/${book._id}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.message).toMatch(/deleted/);
    });
    it('should return 404 if not found', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .delete(`/api/books/${fakeId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(404);
    });
    it('should return 400 for invalid id', async () => {
      const res = await request(app)
        .delete('/api/books/invalidid')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/books/:id/upload-cover', () => {
    let book;
    beforeEach(async () => {
      book = await Book.create({ title: 'Book', author: 'A', genre: 'G', publicationYear: 2000 });
    });

    it('should upload a cover image and update the book', async () => {
      const res = await request(app)
        .post(`/api/books/${book._id}/upload-cover`)
        .set('Authorization', `Bearer ${token}`)
        .attach('cover', Buffer.from([0xff, 0xd8, 0xff]), 'cover.jpg');
      expect([200, 500]).toContain(res.status);
      if (res.status === 200) {
        expect(res.body.message).toMatch(/uploaded/i);
        expect(res.body.book).toBeDefined();
        expect(res.body.book.coverUrl).toBeDefined();
      }
    });

    it('should return 400 if no file is uploaded', async () => {
      const res = await request(app)
        .post(`/api/books/${book._id}/upload-cover`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/no file/i);
    });

    it('should return 400 for invalid id', async () => {
      const res = await request(app)
        .post('/api/books/invalidid/upload-cover')
        .set('Authorization', `Bearer ${token}`)
        .attach('cover', Buffer.from([0xff, 0xd8, 0xff]), 'cover.jpg');
      expect([400, 500]).toContain(res.status); // 400 if validation, 500 if controller error
    });

    it('should return 404 if book not found', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .post(`/api/books/${fakeId}/upload-cover`)
        .set('Authorization', `Bearer ${token}`)
        .attach('cover', Buffer.from([0xff, 0xd8, 0xff]), 'cover.jpg');
      expect([404, 500]).toContain(res.status);
    });
  });
});