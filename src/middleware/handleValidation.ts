import { validationResult } from 'express-validator';
import CustomBadRequestError from '../errors/CustomBadRequestError';
import { Request, Response, NextFunction } from 'express';

export const handleValidation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new CustomBadRequestError('Validation failed', errors.array());
  }
  next();
};
