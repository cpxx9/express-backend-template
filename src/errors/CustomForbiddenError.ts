import { CustomError } from './CustomError';

export class CustomForbiddenError extends CustomError {
  constructor(message: string, info?: unknown) {
    super(message, 403, 'ForbiddenError', info);
  }
}
