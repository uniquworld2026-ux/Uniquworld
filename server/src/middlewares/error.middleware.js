const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');
const config = require('../config');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, _next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  let errors = err.errors || [];

  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  if (err.code === '23505') {
    statusCode = 409;
    message = 'Resource already exists';
  }

  if (err.code === '23503') {
    statusCode = 400;
    message = 'Related resource not found';
  }

  if (!(err instanceof ApiError) || !err.isOperational) {
    logger.error(err.message, {
      stack: err.stack,
      path: req.originalUrl,
      method: req.method,
    });
  }

  const payload = {
    success: false,
    message: statusCode === 500 && config.env === 'production' ? 'Internal server error' : message,
  };

  if (errors.length) {
    payload.errors = errors;
  }

  if (config.env === 'development' && statusCode === 500) {
    payload.stack = err.stack;
  }

  return res.status(statusCode).json(payload);
};

const notFoundHandler = (req, _res, next) => {
  next(ApiError.notFound(`Route ${req.method} ${req.originalUrl} not found`));
};

module.exports = {
  errorHandler,
  notFoundHandler,
};
