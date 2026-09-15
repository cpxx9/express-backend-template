import 'dotenv/config';
import { PassportStatic } from 'passport';
import {
  Strategy as JwtStrategy,
  ExtractJwt,
  StrategyOptions,
  VerifiedCallback
} from 'passport-jwt';
import { prisma } from '../lib/prisma';
import { ACCESS_SECRET } from '../lib/constants';

interface JwtPayload {
  sub: string;
  admin: boolean;
  iat: number;
  exp: number;
}

const options: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: ACCESS_SECRET
};

export default (passport: PassportStatic) => {
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
