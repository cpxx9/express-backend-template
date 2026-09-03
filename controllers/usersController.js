const asyncHandler = require('express-async-handler');
const { prisma } = require('../lib/prisma');
const CustomNotFoundError = require('../errors/CustomNotFoundError');

const userSelect = {
  created: true,
  updated: true,
  username: true,
  email: true,
  firstname: true,
  lastname: true
};

const listUsers = asyncHandler(async (req, res) => {
  const users = await prisma.user.findMany({ select: userSelect });
  res.status(200).json({ success: true, data: users });
});

const listUser = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.params.userId },
    select: userSelect
  });

  if (!user) throw new CustomNotFoundError('User not found');

  res.status(200).json({ success: true, data: user });
});

const updateUser = asyncHandler(async (req, res) => {
  const { firstname, lastname, email } = req.body;
  const data = {};
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

const deleteUser = asyncHandler(async (req, res) => {
  const deletedUser = await prisma.user.delete({
    where: { id: req.params.userId },
    omit: { hash: true }
  });

  res.status(200).json({ success: true, data: deletedUser });
});

module.exports = { listUsers, listUser, updateUser, deleteUser };
