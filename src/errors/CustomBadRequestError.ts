import { CustomError } from './CustomError';

class BadRequestError extends CustomError {
  constructor(message: string, info?: unknown) {
    super(message, 400, 'BadRequestError', info);
  }
}

export = BadRequestError;
