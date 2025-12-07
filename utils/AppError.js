const ErrorTypeStatusCode = {
    INTERNAL_SERVER: 500,
    CLIENT_ERROR : 400
}

class AppError extends Error {
  constructor(message, message_type) {
    super(message);
    this.statusCode = ErrorTypeStatusCode[message_type] || 400;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;