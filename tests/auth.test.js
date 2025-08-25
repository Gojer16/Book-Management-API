const request = require('supertest');
const mongoose = require('mongoose');
const User = require('../models/User');
const app = require('../app');

describe('Auth Integration', () => {
	beforeAll(async () => {
		await mongoose.connection.db.dropDatabase();
	});
	beforeEach(async () => {
		await User.deleteMany({});
	});


	describe('POST /api/auth/register', () => {
		   it('should register a new user and return a token', async () => {
			   const res = await request(app)
				   .post('/api/auth/register')
				   .send({ email: 'newuser@example.com', password: 'Password123!' });
			   expect(res.status).toBe(201);
			   expect(res.body.accessToken).toBeDefined();
			   expect(res.body.success).toBe(true);
		   });
		it('should not register with duplicate email', async () => {
			await User.create({ email: 'dupe@example.com', password: 'Password123!' });
			const res = await request(app)
				.post('/api/auth/register')
				.send({ email: 'dupe@example.com', password: 'Password123!' });
			expect(res.status).toBe(400);
		});
		it('should not register with invalid email', async () => {
			const res = await request(app)
				.post('/api/auth/register')
				.send({ email: 'bademail', password: 'Password123!' });
			expect(res.status).toBe(400);
		});
		it('should not register with weak password', async () => {
			const res = await request(app)
				.post('/api/auth/register')
				.send({ email: 'weak@example.com', password: '123' });
			expect(res.status).toBe(400);
		});
	});

	describe('POST /api/auth/login', () => {
		beforeEach(async () => {
			await request(app)
				.post('/api/auth/register')
				.send({ email: 'loginuser@example.com', password: 'Password123!' });
		});
		   it('should login with correct credentials', async () => {
			   const res = await request(app)
				   .post('/api/auth/login')
				   .send({ email: 'loginuser@example.com', password: 'Password123!' });
			   expect(res.status).toBe(200);
			   expect(res.body.accessToken).toBeDefined();
			   expect(res.body.success).toBe(true);
		   });
		it('should not login with wrong password', async () => {
			const res = await request(app)
				.post('/api/auth/login')
				.send({ email: 'loginuser@example.com', password: 'WrongPass123!' });
			expect(res.status).toBe(400);
		});
		it('should not login with non-existent email', async () => {
			const res = await request(app)
				.post('/api/auth/login')
				.send({ email: 'notfound@example.com', password: 'Password123!' });
			expect(res.status).toBe(400);
		});
		it('should not login with invalid email format', async () => {
			const res = await request(app)
				.post('/api/auth/login')
				.send({ email: 'bademail', password: 'Password123!' });
			expect(res.status).toBe(400);
		});
	});
});


	describe('POST /api/auth/refresh', () => {
		   let cookies;
		   beforeEach(async () => {
			   await request(app)
				   .post('/api/auth/register')
				   .send({ email: 'refreshuser@example.com', password: 'Password123!' });
			   const loginRes = await request(app)
				   .post('/api/auth/login')
				   .send({ email: 'refreshuser@example.com', password: 'Password123!' });
			   cookies = loginRes.headers['set-cookie'];
		   });

		   it('should refresh the token with a valid refresh token (cookie)', async () => {
			   const res = await request(app)
				   .post('/api/auth/refresh')
				   .set('Cookie', cookies);
			   expect(res.status).toBe(200);
			   expect(res.body.accessToken).toBeDefined();
			   expect(res.body.success).toBe(true);
		   });

		   it('should not refresh with missing refresh token', async () => {
			   const res = await request(app)
				   .post('/api/auth/refresh');
			   expect([401, 403]).toContain(res.status);
		   });
	});

	describe('POST /api/auth/logout', () => {
		   let cookies;
		   beforeEach(async () => {
			   await request(app)
				   .post('/api/auth/register')
				   .send({ email: 'logoutuser@example.com', password: 'Password123!' });
			   const loginRes = await request(app)
				   .post('/api/auth/login')
				   .send({ email: 'logoutuser@example.com', password: 'Password123!' });
			   cookies = loginRes.headers['set-cookie'];
		   });
		   it('should logout with a valid refresh token (cookie)', async () => {
			   const res = await request(app)
				   .post('/api/auth/logout')
				   .set('Cookie', cookies);
			   expect(res.status).toBe(200);
			   expect(res.body.success).toBe(true);
			   expect(res.body.message).toMatch(/logged out/i);
		   });
		   it('should not logout with missing refresh token', async () => {
			   const res = await request(app)
				   .post('/api/auth/logout');
			   expect(res.status).toBe(200);
			   expect(res.body.success).toBe(true);
		   });
	});

