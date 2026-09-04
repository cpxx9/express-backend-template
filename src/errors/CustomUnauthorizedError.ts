import { CustomError } from './CustomError';

export class CustomUnauthorizedError extends CustomError {
  constructor(message: string, info?: unknown) {
    super(message, 401, 'NotAuzthorizedError', info);
  }
}
