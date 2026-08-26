class CustomUnauthorizedError extends Error {
  constructor(message, info) {
    super(message);
    this.statusCode = 401;
    // So the error is neat when stringified. NotFoundError: message instead of Error: message
    this.name = 'NotAuthorizedError';
    this.info = info;
  }
}

module.exports = CustomUnauthorizedError;
