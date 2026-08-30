const { prisma } = require('../../lib/prisma');

if (!process.env.DATABASE_URL?.includes('_test')) {
  throw new Error(
    `Refusing to run: DATABASE_URL is not a test DB: ${process.env.DATABASE_URL}`
  );
}

beforeEach(async () => {
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});
