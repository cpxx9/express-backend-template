const request = require('supertest');
const jwt = require('jsonwebtoken');
const { app } = require('../app');
const { prisma } = require('../lib/prisma');
const { createUser, getAccessToken, registerUser } = require('./helpers/auth');

describe('updateUser — privilege escalation is blocked (whitelist)', () => {
  test('cannot set admin:true via PUT', async () => {
    const user = await createUser({ username: 'usera', admin: false });
    const token = await getAccessToken('usera');

    const res = await request(app)
      .put(`/api/users/${user.id}`)
      .set('Authorization', token)
      .send({ firstname: 'Updated', admin: true });

    expect(res.status).toBe(200);
    expect(res.body.data.firstname).toBe('Updated');

    const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
    expect(dbUser.admin).toBe(false);
  });

  test('cannot overwrite the password hash via PUT', async () => {
    const user = await createUser({ username: 'userb' });
    const token = await getAccessToken('userb');
    const before = await prisma.user.findUnique({ where: { id: user.id } });

    const res = await request(app)
      .put(`/api/users/${user.id}`)
      .set('Authorization', token)
      .send({ lastname: 'Changed', hash: 'attacker-controlled-hash' });

    expect(res.status).toBe(200);

    const after = await prisma.user.findUnique({ where: { id: user.id } });
    expect(after.hash).toBe(before.hash);
  });

  test('cannot change username via PUT', async () => {
    const user = await createUser({ username: 'userc' });
    const token = await getAccessToken('userc');

    await request(app)
      .put(`/api/users/${user.id}`)
      .set('Authorization', token)
      .send({ username: 'hijacked' });

    const after = await prisma.user.findUnique({ where: { id: user.id } });
    expect(after.username).toBe('userc');
  });
});

describe('No sensitive data leaks in responses', () => {
  test('register response contains no hash/salt', async () => {
    const { res } = await registerUser();
    const body = JSON.stringify(res.body);
    expect(body).not.toMatch(/hash/i);
    expect(body).not.toMatch(/salt/i);
  });

  test('login response contains no hash/salt', async () => {
    await registerUser();
    const res = await request(app)
      .post('/api/login')
      .send({ username: 'testuser', password: 'secretsauce' });
    const body = JSON.stringify(res.body);
    expect(body).not.toMatch(/hash/i);
    expect(body).not.toMatch(/salt/i);
  });

  test('updateUser response omits hash', async () => {
    const user = await createUser({ username: 'userd' });
    const token = await getAccessToken('userd');
    const res = await request(app)
      .put(`/api/users/${user.id}`)
      .set('Authorization', token)
      .send({ firstname: 'New' });

    expect(res.body.data.hash).toBeUndefined();
  });

  test('listUser response omits hash', async () => {
    const user = await createUser({ username: 'usere' });
    const token = await getAccessToken('usere');
    const res = await request(app)
      .get(`/api/users/${user.id}`)
      .set('Authorization', token);

    expect(res.body.data.hash).toBeUndefined();
  });
});

describe('JWT payload contains only safe claims', () => {
  test('access token payload is limited to sub, admin, iat, exp', async () => {
    await registerUser();
    const res = await request(app)
      .post('/api/login')
      .send({ username: 'testuser', password: 'secretsauce' });

    const raw = res.body.token.replace(/^Bearer /, '');
    const decoded = jwt.decode(raw);

    expect(Object.keys(decoded).sort()).toEqual(
      ['admin', 'exp', 'iat', 'sub'].sort()
    );
    expect(decoded.sub).toBeDefined();
    expect(decoded).not.toHaveProperty('hash');
    expect(decoded).not.toHaveProperty('salt');
    expect(decoded).not.toHaveProperty('username');
  });
});
