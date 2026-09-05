const normalizePrismaError = (err) => {
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

const isPrimaError = (err) =>
  typeof err.code === 'string' && /^P\d{4}$/.test(err.code);

// eslint-disable-next-line no-unused-vars
const errorController = (err, req, res, next) => {
  const normalized = isPrimaError(err) ? normalizePrismaError(err) : err;
  const status = normalized.statusCode || 500;

  if (status >= 500) console.error(err);

  res.status(status).json({
    title: normalized.name,
    status,
    message: normalized.message,
    info: normalized.info
  });
};

module.exports = { errorController };
