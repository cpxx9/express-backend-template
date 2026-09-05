export class CustomError extends Error {
  statusCode: number;
  info?: unknown;

  constructor(
    message: string,
    statusCode: number,
    name: string,
    info?: unknown
  ) {
    super(message);
    this.statusCode = statusCode;
    this.name = name;
    this.info = info;
  }
}
