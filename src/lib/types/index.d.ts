import type { User as PrismaUser } from '../../generated/prisma/client.js';

declare global {
  namespace Express {
    // Makes req.user carry your real Prisma User shape (id, admin, hash, ...)
    interface User extends PrismaUser {}
  }
}

// express-async-handler ships no type declarations; declare it so strict/noImplicitAny is satisfied
declare module 'express-async-handler' {
  import { RequestHandler } from 'express';
  function expressAsyncHandler(
    handler: (...args: Parameters<RequestHandler>) => unknown
  ): RequestHandler;
  export = expressAsyncHandler;
}
