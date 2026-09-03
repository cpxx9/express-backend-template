class CustomUnauthorizedError extends Error {
  constructor(message, info) {
    super(message);
    this.name = 'NotAuthorizedError';
    this.statusCode = 401;
    this.info = info;
  }
}

module.exports = CustomUnauthorizedError;
