require('dotenv/config');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const { prisma } = require('../lib/prisma');

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.ACCESS_SECRET
};

module.exports = (passport) => {
  passport.use(
    new JwtStrategy(options, async (payload, done) => {
      try {
        const user = await prisma.user.findUnique({
          where: { id: payload.sub }
        });
        if (user) {
          return done(null, user);
        }
        return done(null, false, { message: 'not signed in' });
      } catch (err) {
        return done(err, false, { message: 'not signed in' });
      }
    })
  );
};
