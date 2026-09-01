require('dotenv/config');
const bcrypt = require('bcryptjs');
const crypto = require('node:crypto');
const jsonwebtoken = require('jsonwebtoken');
const { ACCESS_EXP, REFRESH_EXP, REFRESH_EXP_MS } = require('../lib/constants');

function validPassword(password, hash) {
  return bcrypt.compareSync(password, hash);
}

function genPassword(password) {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  return {
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

  const refreshToken = jsonwebtoken.sign(
    { ...payload, jti: crypto.randomUUID() },
    process.env.REFRESH_SECRET,
    {
      expiresIn: REFRESH_EXP
    }
  );

  return {
    accessToken: {
      token: `Bearer ${accessToken}`,
      expires: ACCESS_EXP
    },
    refreshToken: {
      token: refreshToken,
      expires: REFRESH_EXP,
      expiresAt: new Date(Date.now() + REFRESH_EXP_MS)
    }
  };
}

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

module.exports = {
  validPassword,
  genPassword,
  issueJWT,
  hashToken
};
