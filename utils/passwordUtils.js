require('dotenv/config');
const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
const { ACCESS_EXP, REFRESH_EXP, REFRESH_EXP_MS } = require('../lib/constants');

function validPassword(password, hash, salt) {
  const hashVerify = bcrypt.hashSync(password, salt);
  return hash === hashVerify;
}

function genPassword(password) {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  return {
    salt,
    hash
  };
}

function issueJWT(user) {
  const payload = {
    sub: user.id,
    admin: user.admin
  };

  const accessToken = jsonwebtoken.sign(payload, process.env.ACCESS_SECRET, {
    expiresIn: ACCESS_EXP
  });

  const refreshToken = jsonwebtoken.sign(payload, process.env.REFRESH_SECRET, {
    expiresIn: REFRESH_EXP
  });

  return {
    accessToken: {
      token: `Bearer ${accessToken}`,
      expires: ACCESS_EXP
    },
    refreshToken: {
      token: refreshToken,
      expires: ACCESS_EXP,
      expiresAt: new Date(Date.now() + REFRESH_EXP_MS)
    }
  };
}

module.exports = {
  validPassword,
  genPassword,
  issueJWT
};
