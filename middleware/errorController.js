const errorController = (err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    title: err.name,
    status: err.statusCode,
    message: err.message,
    info: err.info
  });
};

const prismaErrController = (err) => {
  const newErr = {};
  switch (err.code) {
    case 'P2002':
      newErr.name = `Prisma Error: ${err.code}`;
      newErr.statusCode = 409;
      newErr.message = `${err.meta.target[0]} field must be unique!`;
      break;
    case 'P2025':
      newErr.name = `Prisma Error: ${err.code}`;
      newErr.statusCode = 404;
      newErr.message = 'Record not found';
      break;
    default:
      newErr.name =
        err.name ||
        (err.code && `Database Error: ${err.code}`) ||
        'Database Error';
      newErr.statusCode = 500;
      newErr.message = err.message || 'An unexpected database error occurred';
  }
  return newErr;
};

module.exports = { errorController, prismaErrController };
