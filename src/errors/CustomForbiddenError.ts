import { CustomError } from './CustomError';

class CustomForbiddenError extends CustomError {
  constructor(message: string, info?: unknown) {
    super(message, 403, 'ForbiddenError', info);
  }
}

export = CustomForbiddenError;
