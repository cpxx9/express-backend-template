const request = require('supertest');
const { app } = require('../app');
const { registerUser, validUser } = require('./helpers/auth');

describe('POST /api/register — validation & duplicates', () => {
  test('duplicate username returns 409', async () => {
    await registerUser();
    const { res } = await registerUser();
    expect(res.status).toBe(409);
  });

  test('short username returns 400', async () => {
    const { res } = await registerUser({ username: 'ab' });
    expect(res.status).toBe(400);
  });

  test('mismatched confirmPassword returns 400', async () => {
    const { res } = await registerUser({ confirmPassword: 'doesNotMatch' });
    expect(res.status).toBe(400);
  });

  test('short password returns 400', async () => {
    const { res } = await registerUser({
      password: 'short',
      confirmPassword: 'short'
    });
    expect(res.status).toBe(400);
  });
});

describe('POST /api/login — failure modes', () => {
  test('wrong password returns 401', async () => {
    await registerUser();
    const res = await request(app)
      .post('/api/login')
      .send({ username: validUser.username, password: 'wrongpassword' });
    expect(res.status).toBe(401);
  });

  test('unknown user returns 401', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ username: 'nobodyhere', password: 'whatever' });
    expect(res.status).toBe(401);
  });

  test('wrong password and unknown user return the SAME message (no enumeration)', async () => {
    await registerUser();
    const wrongPass = await request(app)
      .post('/api/login')
      .send({ username: validUser.username, password: 'wrongpassword' });
    const noUser = await request(app)
      .post('/api/login')
      .send({ username: 'nobodyhere', password: 'whatever' });

    expect(wrongPass.status).toBe(noUser.status);
    expect(wrongPass.body.msg).toBe(noUser.body.msg);
    expect(wrongPass.body.msg).toBeDefined();
  });
});

describe('POST /api/refresh — edge cases', () => {
  test('no cookie returns 401', async () => {
    const res = await request(app).post('/api/refresh');
    expect(res.status).toBe(401);
  });

  test('garbage cookie returns 403', async () => {
    const res = await request(app)
      .post('/api/refresh')
      .set('Cookie', ['jwt=not-a-real-token']);
    expect(res.status).toBe(403);
  });
});

describe('Unknown routes', () => {
  test('unmatched path returns 404', async () => {
    const res = await request(app).get('/api/does-not-exist');
    expect(res.status).toBe(404);
  });
});
