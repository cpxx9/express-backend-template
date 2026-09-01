const { prisma } = require('../lib/prisma');

const listUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        created: true,
        updated: true,
        username: true,
        email: true,
        firstname: true,
        lastname: true
        // posts: {
        //   include: { authorId: false }
        // },
        // comments: true
      }
    });
    res.status(200).json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
};

const listUser = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.params.userId
      },
      select: {
        created: true,
        updated: true,
        username: true,
        email: true,
        firstname: true,
        lastname: true
        // posts: true,
        // comments: true
      }
    });

    if (!user) {
      return res.status(404).json({ success: false, msg: 'User not found!' });
    }

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  const { firstname, lastname, email } = req.body;
  const data = {};
  if (firstname !== undefined) data.firstname = firstname;
  if (lastname !== undefined) data.lastname = lastname;
  if (email !== undefined) data.email = email;

  try {
    const user = await prisma.user.update({
      where: { id: req.params.userId },
      data,
      omit: { hash: true }
    });
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const deletedUser = await prisma.user.delete({
      where: { id: req.params.userId }
    });

    delete deletedUser.hash;
    delete deletedUser.salt;

    res.status(200).json({ success: true, data: deletedUser });
  } catch (err) {
    next(err);
  }
};

module.exports = { listUsers, listUser, updateUser, deleteUser };
