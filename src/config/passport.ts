import 'dotenv/config';
import { PassportStatic } from 'passport';
import {
  Strategy as JwtStrategy,
  ExtractJwt,
  StrategyOptionsWithoutRequest,
  VerifiedCallback
} from 'passport-jwt';
import { prisma } from '../lib/prisma';

interface JwtPayload {
  sub: string;
  admin: boolean;
  iat: number;
  exp: number;
}

const options: StrategyOptionsWithoutRequest = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.ACCESS_SECRET as string
};

function configurePassport(passport: PassportStatic): void {
  passport.use(
    new JwtStrategy(
      options,
      async (payload: JwtPayload, done: VerifiedCallback) => {
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
      }
    )
  );
}

export = configurePassport;
