import asyncHandler from 'express-async-handler';
import { prisma } from '../lib/prisma';
import CustomNotFoundError from '../errors/CustomNotFoundError';
import { Request, Response } from 'express';

const userSelect = {
  created: true,
  updated: true,
  username: true,
  email: true,
  firstname: true,
  lastname: true
};

export const listUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await prisma.user.findMany({ select: userSelect });
  res.status(200).json({ success: true, data: users });
});

export const listUser = asyncHandler(async (req: Request, res: Response) => {
  if (typeof req.params.userId !== 'string')
    throw new CustomNotFoundError('User not found');
  const user = await prisma.user.findUnique({
    where: { id: req.params.userId },
    select: userSelect
  });

  if (!user) throw new CustomNotFoundError('User not found');

  res.status(200).json({ success: true, data: user });
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  if (typeof req.params.userId !== 'string')
    throw new CustomNotFoundError('User not found');
  const { firstname, lastname, email } = req.body;
  const data: { firstname?: string; lastname?: string; email?: string } = {};
  if (firstname !== undefined) data.firstname = firstname;
  if (lastname !== undefined) data.lastname = lastname;
  if (email !== undefined) data.email = email;

  const user = await prisma.user.update({
    where: { id: req.params.userId },
    data,
    omit: { hash: true }
  });
  res.status(200).json({ success: true, data: user });
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  if (typeof req.params.userId !== 'string')
    throw new CustomNotFoundError('User not found');
  const deletedUser = await prisma.user.delete({
    where: { id: req.params.userId },
    omit: { hash: true }
  });

  res.status(200).json({ success: true, data: deletedUser });
});
