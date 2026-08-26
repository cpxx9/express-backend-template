require('dotenv/config');
const crypto = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
const { prisma } = require('../lib/prisma');

function validPassword(password, hash, salt) {
  const hashVerify = crypto.hashSync(password, salt);
  return hash === hashVerify;
}

function genPassword(password) {
  const salt = crypto.genSaltSync(10);
  const hash = crypto.hashSync(password, salt);
  console.log(salt);
  console.log(hash);

  return {
    salt,
    hash
  };
}

async function issueJWT(user) {
  const payload = {
    sub: user.id,
    user,
    iat: Math.floor(Date.now() / 1000)
  };

  const accessToken = jsonwebtoken.sign(payload, process.env.ACCESS_SECRET, {
    // change to 10-15m for prod
    expiresIn: '10m'
  });

  const refreshToken = jsonwebtoken.sign(payload, process.env.REFRESH_SECRET, {
    expiresIn: '1d'
  });

  await prisma.user.update({
    where: {
      id: user.id
    },
    data: {
      refresh: refreshToken
    }
  });

  return {
    accessToken: {
      token: `Bearer ${accessToken}`,
      expires: accessToken.expiresIn
    },
    refreshToken: {
      token: `Bearer ${refreshToken}`,
      expires: refreshToken.expiresIn
    }
  };
}

module.exports = {
  validPassword,
  genPassword,
  issueJWT
};
