class CustomConflictError extends Error {
  constructor(message, info) {
    super(message);
    this.name = 'ConflictError';
    this.statusCode = 409;
    this.info = info;
  }
}

module.exports = CustomConflictError;
