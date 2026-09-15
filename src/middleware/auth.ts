import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import CustomNotFoundError from '../errors/CustomNotFoundError';
import CustomForbiddenError from '../errors/CustomForbiddenError';

export const notFound = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    throw new CustomNotFoundError('This api route does not exist');
  }
);

export const checkIfAdmin = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.user!.admin) {
      next();
    } else {
      throw new CustomForbiddenError('Only admins can access this route');
    }
  }
);

export const checkIfUserMatch = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.user!.id === req.params.userId || req.user!.admin) {
      next();
    } else {
      throw new CustomForbiddenError(
        'You must be logged in as this user to access this account'
      );
    }
  }
);
