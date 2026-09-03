const request = require('supertest');
const { app } = require('../app');
const { prisma } = require('../lib/prisma');
const { createUser } = require('./helpers/auth');

const THRESHOLD = 5;
const PASSWORD = 'secretsauce';

async function failLogin(username, times) {
  const results = [];
  for (let i = 0; i < times; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    const res = await request(app)
      .post('/api/login')
      .send({ username, password: 'wrongpassword' });
    results.push(res);
  }
  return results;
}

describe('Login backoff — failure tracking', () => {
  test('failedAttempts increments on each wrong password', async () => {
    const user = await createUser({ username: 'backoff1' });

    await failLogin('backoff1', 3);

    const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
    expect(dbUser.failedAttempts).toBe(3);
  });

  test('account locks after crossing the failure threshold', async () => {
    const user = await createUser({ username: 'backoff2' });

    await failLogin('backoff2', THRESHOLD + 1);

    const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
    expect(dbUser.failedAttempts).toBe(THRESHOLD + 1);
    expect(dbUser.lockedUntil).not.toBeNull();
    expect(dbUser.lockedUntil.getTime()).toBeGreaterThan(Date.now());
  });
});

describe('Login backoff — lock enforcement', () => {
  test('locked account is rejected EVEN WITH the correct password', async () => {
    await createUser({ username: 'backoff3' });

    await failLogin('backoff3', THRESHOLD + 1);

    const res = await request(app)
      .post('/api/login')
      .send({ username: 'backoff3', password: PASSWORD });

    expect(res.status).toBe(401);
  });

  test('lock rejection uses the same generic message (no enumeration)', async () => {
    await createUser({ username: 'backoff4' });
    await failLogin('backoff4', THRESHOLD + 1);

    const lockedRes = await request(app)
      .post('/api/login')
      .send({ username: 'backoff4', password: PASSWORD });

    const unknownRes = await request(app)
      .post('/api/login')
      .send({ username: 'doesnotexist', password: 'whatever' });

    expect(lockedRes.status).toBe(unknownRes.status);
    expect(lockedRes.body.message).toBe(unknownRes.body.message);
  });
});

describe('Login backoff — reset & expiry', () => {
  test('successful login resets failedAttempts and lockedUntil', async () => {
    const user = await createUser({ username: 'backoff5' });

    await failLogin('backoff5', THRESHOLD - 1);

    const res = await request(app)
      .post('/api/login')
      .send({ username: 'backoff5', password: PASSWORD });

    expect(res.status).toBe(200);

    const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
    expect(dbUser.failedAttempts).toBe(0);
    expect(dbUser.lockedUntil).toBeNull();
  });

  test('an expired lock allows a correct login again', async () => {
    const user = await createUser({ username: 'backoff6' });

    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedAttempts: THRESHOLD + 1,
        lockedUntil: new Date(Date.now() - 1000)
      }
    });

    const res = await request(app)
      .post('/api/login')
      .send({ username: 'backoff6', password: PASSWORD });

    expect(res.status).toBe(200);

    const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
    expect(dbUser.failedAttempts).toBe(0);
    expect(dbUser.lockedUntil).toBeNull();
  });
});
