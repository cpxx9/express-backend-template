import { CustomError } from './CustomError';

class CustomUnauthorizedError extends CustomError {
  constructor(message: string, info?: unknown) {
    super(message, 409, 'ConflictError', info);
  }
}

export = CustomUnauthorizedError;
