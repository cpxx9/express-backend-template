const jwt = require('jsonwebtoken');
const request = require('supertest');
const { app } = require('../app');
const { prisma } = require('../lib/prisma');
const {
  registerUser,
  loginUser,
  getJwtValue,
  validUser
} = require('./helpers/auth');
const { hashToken } = require('../utils/passwordUtils');

describe('POST /api/login and /api/refresh - session creation and rotation', () => {
  test('logs in and inserts one new session row', async () => {
    await registerUser();
    await prisma.refreshToken.deleteMany();

    const { res } = await loginUser();

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toMatch(/^Bearer/);

    const sessions = await prisma.refreshToken.findMany();
    expect(sessions).toHaveLength(1);
  });

  test('two logins as the same user create two different sessions', async () => {
    await registerUser();
    await prisma.refreshToken.deleteMany();

    const first = await loginUser();
    const second = await loginUser();

    const sessions = await prisma.refreshToken.findMany();
    expect(sessions).toHaveLength(2);

    const tokenA = getJwtValue(first.cookie);
    const tokenB = getJwtValue(second.cookie);
    expect(tokenA).not.toBe(tokenB);
  });

  test('refreshing one session does not affect another', async () => {
    await registerUser();
    await prisma.refreshToken.deleteMany();

    const first = await loginUser();
    const second = await loginUser();

    const secondTokenBeforeRefresh = getJwtValue(second.cookie);

    await request(app).get('/api/refresh').set('Cookie', first.cookie);

    const secondTokenAfterFresh = await prisma.refreshToken.findUnique({
      where: { token: hashToken(secondTokenBeforeRefresh) }
    });
    expect(secondTokenAfterFresh).not.toBe(null);
    expect(secondTokenAfterFresh.token).toBe(
      hashToken(secondTokenBeforeRefresh)
    );
  });

  test('Original token gets rejected after new one is made, 403 status', async () => {
    const { cookie } = await registerUser();
    const oldToken = getJwtValue(cookie);

    await request(app).get('/api/refresh').set('Cookie', cookie);

    const res = await request(app)
      .get('/api/refresh')
      .set('Cookie', [`jwt=${oldToken}`]);

    expect(res.status).toBe(403);
  });
});

describe('GET /api/logout session isolation and rejecting old sessions', () => {
  test('logging out on one device keeps sessions on other devices in tact', async () => {
    await registerUser();
    await prisma.refreshToken.deleteMany();

    const first = await loginUser();
    const second = await loginUser();
    const secondTokenBeforeLogout = getJwtValue(second.cookie);

    const res = await request(app)
      .get('/api/logout')
      .set('Cookie', first.cookie);
    expect(res.status).toBe(204);

    const remaining = await prisma.refreshToken.findMany();
    expect(remaining).toHaveLength(1);
    expect(remaining[0].token).toBe(hashToken(secondTokenBeforeLogout));
  });

  test('logout with no cookie is a safe 204 no-op', async () => {
    const res = await request(app).get('/api/logout');
    expect(res.status).toBe(204);
  });

  test('expired session is rejected with 403 and deleted', async () => {
    await registerUser();
    const user = await prisma.user.findUnique({
      where: { username: validUser.username }
    });

    const expiredToken = jwt.sign(
      { sub: user.id, admin: user.admin },
      process.env.REFRESH_SECRET,
      { expiresIn: '-10s' }
    );

    await prisma.refreshToken.deleteMany();
    await prisma.refreshToken.create({
      data: {
        token: hashToken(expiredToken),
        userId: user.id,
        expiresAt: new Date(Date.now() - 1000)
      }
    });

    const res = await request(app)
      .get('/api/refresh')
      .set('Cookie', [`jwt=${expiredToken}`]);

    expect(res.status).toBe(403);

    const rows = await prisma.refreshToken.findMany();
    expect(rows).toHaveLength(0);
  });
});
