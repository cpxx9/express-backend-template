class CustomBadRequestError extends Error {
  constructor(message, info) {
    super(message);
    this.name = 'BadRequestError';
    this.statusCode = 400;
    this.info = info;
  }
}

module.exports = CustomBadRequestError;
