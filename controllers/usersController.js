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
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  const oldUser = req.user;
  const data = { ...req.body };
  delete data.id;
  delete data.refresh;
  delete data.admin;
  delete data.author;

  try {
    const user = await prisma.user.update({
      where: {
        id: req.params.userId
      },
      data
    });
    delete user.hash;
    delete oldUser.hash;
    delete user.salt;
    delete oldUser.salt;
    delete user.refresh;
    delete oldUser.refresh;
    res.status(200).json({ success: true, data: [user, oldUser] });
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  const deleteComments = prisma.comment.deleteMany({
    where: {
      authorId: req.params.userId
    }
  });

  const deletePosts = prisma.post.deleteMany({
    where: {
      authorId: req.params.userId
    }
  });

  const deletedUser = prisma.user.delete({
    where: {
      id: req.params.userId
    }
  });
  try {
    const deletedUserTransaction = await prisma.$transaction([
      deleteComments,
      deletePosts,
      deletedUser
    ]);
    res.status(200).json({ success: true, data: deletedUserTransaction });
  } catch (err) {
    next(err);
  }
};

module.exports = { listUsers, listUser, updateUser, deleteUser };
