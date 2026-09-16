import { Request, Response } from 'express';

export const displayHome = async (req: Request, res: Response) => {
  res.status(200).json({ status: 'success', data: 'You are authenticated' });
};
