const cron = require('node-cron');
const { prisma } = require('../lib/prisma');

async function pruneExpiredSessions() {
  const { count } = await prisma.refreshToken.deleteMany({
    where: { expiresAt: { lt: new Date() } }
  });
  if (count > 0) {
    console.log(`[pruneSessions] Removed ${count} expired session(s)`);
  }
  return count;
}

function startSessionPruning() {
  return cron.schedule(
    '0 3 * * *', // every day at 3:00 AM
    async () => {
      try {
        await pruneExpiredSessions();
      } catch (err) {
        console.error('[pruneSessions] Failed:', err);
      }
    },
    { timezone: 'America/New_York' }
  );
}

module.exports = { startSessionPruning, pruneExpiredSessions };
