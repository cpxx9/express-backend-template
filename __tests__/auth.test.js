const request = require('supertest');
const { app } = require('../app');
const { prisma } = require('../lib/prisma');

describe('POST /api/register', () => {
  test('creates a user and exactly one session row', async () => {
    const res = await request(app).post('/api/register').send({
      username: 'testuser',
      email: 'test@example.com',
      firstname: 'Test',
      lastname: 'User',
      password: 'supersecret',
      confirmPassword: 'supersecret'
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toMatch(/^Bearer /);

    const sessions = await prisma.refreshToken.findMany();
    expect(sessions).toHaveLength(1);
  });
});
