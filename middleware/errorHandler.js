const AppError = require('../utils/AppError');

function errorHandler(err, req, res, next) {
  let statusCode = 500;
  let message = err.message || 'Internal Server Error';

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  res.status(statusCode).json({
    status: 'error',
    message,
  });
}

module.exports = errorHandler;