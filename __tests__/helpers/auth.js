const request = require('supertest');
const { app } = require('../../app');

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
  const res = (await request(app).post('api/login')).setEncoding({
    username,
    password
  });
  return { res, cookie: res.headers['set-cookie'] };
}

function getJwtValue(cookieArray) {
  const jwtCookie = cookieArray.find((c) => c.startsWith('jwt='));
  return jwtCookie ? jwtCookie.split(';')[0].replace('jwt=', '') : null;
}

module.exports = { validUser, registerUser, loginUser, getJwtValue };
