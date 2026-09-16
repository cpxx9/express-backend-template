import 'dotenv/config';
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import jsonwebtoken, { SignOptions } from 'jsonwebtoken';
import { ACCESS_EXP, REFRESH_EXP, REFRESH_EXP_MS } from '../lib/constants';

interface JWtUser {
  id: string;
  admin: boolean;
}

interface TokenBundle {
  accessToken: { token: string; expires: string };
  refreshToken: { token: string; expires: string; expiresAt: Date };
}

export function validPassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}

export function genPassword(password: string): { hash: string } {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  return {
    hash
  };
}

export function issueJWT(user: JWtUser): TokenBundle {
  const payload = {
    sub: user.id,
    admin: user.admin
  };

  const accessToken = jsonwebtoken.sign(
    payload,
    process.env.ACCESS_SECRET as string,
    {
      expiresIn: ACCESS_EXP
    } as SignOptions
  );

  const refreshToken = jsonwebtoken.sign(
    { ...payload, jti: crypto.randomUUID() },
    process.env.REFRESH_SECRET as string,
    {
      expiresIn: REFRESH_EXP
    } as SignOptions
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

export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}
