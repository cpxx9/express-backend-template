import type { User as PrismaUser } from '../../generated/prisma/client.js';

declare global {
  namespace Express {
    interface User extends PrismaUser {}
  }
}

declare module 'express-async-handler' {
  import { RequestHandler } from 'express';
  function expressAsyncHandler(
    handler: (...args: Parameters<RequestHandler>) => unknown
  ): RequestHandler;
  export = expressAsyncHandler;
}
