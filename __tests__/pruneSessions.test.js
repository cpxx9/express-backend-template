const { prisma } = require('../src/lib/prisma');
const { pruneExpiredSessions } = require('../src/jobs/pruneSessions');
const { createUser } = require('./helpers/auth');

describe('pruneExpiredSessions', () => {
  test('deletes expired sessions and keeps valid ones', async () => {
    const user = await createUser({ username: 'pruneuser' });

    await prisma.refreshToken.createMany({
      data: [
        {
          token: 'expired-1',
          userId: user.id,
          expiresAt: new Date(Date.now() - 60_000)
        },
        {
          token: 'expired-2',
          userId: user.id,
          expiresAt: new Date(Date.now() - 1000)
        },
        {
          token: 'valid-1',
          userId: user.id,
          expiresAt: new Date(Date.now() + 60_000)
        }
      ]
    });

    const count = await pruneExpiredSessions();

    expect(count).toBe(2);

    const remaining = await prisma.refreshToken.findMany();
    expect(remaining).toHaveLength(1);
    expect(remaining[0].token).toBe('valid-1');
  });

  test('returns 0 when there are no expired sessions', async () => {
    const user = await createUser({ username: 'pruneuser2' });
    await prisma.refreshToken.create({
      data: {
        token: 'valid-only',
        userId: user.id,
        expiresAt: new Date(Date.now() + 60_000)
      }
    });

    const count = await pruneExpiredSessions();

    expect(count).toBe(0);
    const remaining = await prisma.refreshToken.findMany();
    expect(remaining).toHaveLength(1);
  });
});
