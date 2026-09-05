const request = require('supertest');
const { app } = require('../../src/app');
const { prisma } = require('../../src/lib/prisma');
const { genPassword } = require('../../src/utils/passwordUtils');

const validUser = {
  username: 'testuser',
  email: 'test@email.com',
  firstname: 'Test',
  lastname: 'User',
  password: 'secretsauce',
  confirmPassword: 'secretsauce'
};

async function registerUser(overrides = {}) {
  const res = await request(app)
    .post('/api/register')
    .send({ ...validUser, ...overrides });
  return { res, cookie: res.headers['set-cookie'] };
}

async function loginUser(
  username = validUser.username,
  password = validUser.password
) {
  const res = await request(app).post('/api/login').send({
    username,
    password
  });
  return { res, cookie: res.headers['set-cookie'] };
}

function getJwtValue(cookieArray) {
  const jwtCookie = cookieArray.find((c) => c.startsWith('jwt='));
  return jwtCookie ? jwtCookie.split(';')[0].replace('jwt=', '') : null;
}

async function createUser({
  username = 'seeduser',
  admin = false,
  password = 'secretpass'
} = {}) {
  const uname = username.toLowerCase();
  const { hash } = genPassword(password);
  return prisma.user.create({
    data: {
      username: uname,
      email: `${uname}@test.com`,
      firstname: 'test',
      lastname: 'User',
      admin,
      hash
    }
  });
}

async function getAccessToken(username, password = 'secretpass') {
  const res = await request(app).post('/api/login').send({
    username,
    password
  });
  return res.body.token;
}

module.exports = {
  validUser,
  registerUser,
  loginUser,
  getJwtValue,
  createUser,
  getAccessToken
};
