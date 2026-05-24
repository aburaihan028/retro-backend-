class CustomError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.message = message || "Error Occured Try Again";
    this.status =
      statusCode >= 400 && statusCode < 500 ? "client Error" : "server Error";
    this.statusCode = statusCode;
    this.isOperationalError =
      statusCode >= 400 && statusCode < 500 ? false : true;
    this.data = null;
    Error.captureStackTrace(this, this.constructor);
  }
}

export { CustomError };
