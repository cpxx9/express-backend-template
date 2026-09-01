const request = require('supertest');
const { app } = require('../app');
const { createUser, getAccessToken } = require('./helpers/auth');

const FAKE_ID = '00000000-0000-0000-0000-000000000000';

describe('GET /api/users - ensure user is admin', () => {
  test('no token returns 401', async () => {
    const res = await request(app).get('/api/users');
    expect(res.status).toBe(401);
  });

  test('non-admin token returns 403', async () => {
    await createUser({ username: 'regular', admin: false });
    const token = await getAccessToken('regular');
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', token);
    expect(res.status).toBe(403);
  });

  test('admin token returns 200', async () => {
    await createUser({ username: 'admin', admin: true });
    const token = await getAccessToken('admin');
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', token);
    expect(res.status).toBe(200);
  });
});

describe('/api/users/:userId - ensure ownership', () => {
  test('user can access their own record (200)', async () => {
    const userA = await createUser({ username: 'usera' });
    const token = await getAccessToken('usera');

    const res = await request(app)
      .get(`/api/users/${userA.id}`)
      .set('Authorization', token);
    expect(res.status).toBe(200);
  });

  test("user cannot access another user's record (403)", async () => {
    await createUser({ username: 'usera' });
    const userB = await createUser({ username: 'userb' });
    const token = await getAccessToken('usera');

    const res = await request(app)
      .get(`/api/users/${userB.id}`)
      .set('Authorization', token);
    expect(res.status).toBe(403);
  });

  test("admin can access every users' record (200)", async () => {
    await createUser({ username: 'admin1', admin: true });
    const userB = await createUser({ username: 'userb' });
    const token = await getAccessToken('admin1');

    const res = await request(app)
      .get(`/api/users/${userB.id}`)
      .set('Authorization', token);
    expect(res.status).toBe(200);
  });
});

describe('/api/users/:userId - not found (404)', () => {
  test('GET nonexistent user returns 404', async () => {
    await createUser({ username: 'admin1', admin: true });
    const token = await getAccessToken('admin1');

    const res = await request(app)
      .get(`/api/users/${FAKE_ID}`)
      .set('Authorization', token);
    expect(res.status).toBe(404);
  });

  test('DELETE nonexistent user returns 404', async () => {
    await createUser({ username: 'admin2', admin: true });
    const token = await getAccessToken('admin2');

    const res = await request(app)
      .delete(`/api/users/${FAKE_ID}`)
      .set('Authorization', token);
    expect(res.status).toBe(404);
  });
});
