const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app'); // your Express app
const Book = require('../models/book');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI_TEST); // separate test DB
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

beforeEach(async () => {
  await Book.deleteMany({});
});

describe('GET /api/books', () => {

  beforeEach(async () => {
    // Insert sample books
    await Book.create([
      { title: 'The Hobbit', author: 'Tolkien', genre: 'Fantasy', tags: ['adventure'], publicationYear: 1937, rating: 9 },
      { title: '1984', author: 'Orwell', genre: 'Dystopia', tags: ['political'], publicationYear: 1949, rating: 10 },
      { title: 'Harry Potter', author: 'Rowling', genre: 'Fantasy', tags: ['magic'], publicationYear: 1997, rating: 8 },
    ]);
  });

  it('should return all books with default pagination', async () => {
    const res = await request(app).get('/api/books');
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(3);
    expect(res.body.results.length).toBe(3);
    expect(res.body.page).toBe(1);
    expect(res.body.totalPages).toBe(1);
  });

  it('should filter books by genre', async () => {
    const res = await request(app).get('/api/books?genre=Fantasy');
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(2);
    expect(res.body.results.every(b => b.genre === 'Fantasy')).toBe(true);
  });

  it('should filter by tags array', async () => {
    const res = await request(app).get('/api/books?tags=magic');
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(1);
    expect(res.body.results[0].tags).toContain('magic');
  });

  it('should sort by rating desc', async () => {
    const res = await request(app).get('/api/books?sort=rating&order=desc');
    expect(res.status).toBe(200);
    expect(res.body.results[0].rating).toBe(10);
  });

  it('should paginate results', async () => {
    const res = await request(app).get('/api/books?limit=2&page=2');
    expect(res.status).toBe(200);
    expect(res.body.results.length).toBe(1);
    expect(res.body.page).toBe(2);
  });

  it('should validate query params with Joi', async () => {
    const res = await request(app).get('/api/books?sort=invalid');
    expect(res.status).toBe(400); // assuming you return 400 for Joi validation errors
  });

});
