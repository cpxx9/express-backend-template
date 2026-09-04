import { CustomError } from './CustomError';

class CustomUnauthorizedError extends CustomError {
  constructor(message: string, info?: unknown) {
    super(message, 404, 'NotFoundError', info);
  }
}

export = CustomUnauthorizedError;
