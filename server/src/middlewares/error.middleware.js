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

  if (err.type === 'entity.too.large') {
    statusCode = 413;
    message = 'Request too large. Use images under 2 MB each or fewer gallery photos.';
  }

  if (err.code === 'LIMIT_FILE_SIZE' || err.name === 'MulterError') {
    statusCode = 400;
    message = err.code === 'LIMIT_FILE_SIZE' ? 'Song must be under 8 MB' : err.message || 'Upload failed';
  }

  if (err.code === '23505') {
    statusCode = 409;
    message = 'Resource already exists';
  }

  if (err.code === '23503') {
    statusCode = 400;
    const detail = String(err.detail || err.message || '');
    if (/roles/i.test(detail) || /role_id/i.test(detail)) {
      message = 'Account roles are not set up. Ask an admin to run database seed.';
    } else if (/product_id/i.test(detail)) {
      message = 'One or more products in your cart could not be linked. Refresh the page and try again.';
    } else if (/store_product_id/i.test(detail)) {
      message = 'A store product in your cart is no longer available. Refresh and try again.';
    } else if (/shipping_address_id|billing_address_id/i.test(detail)) {
      message = 'Saved address not found. Choose another address or enter a new one.';
    } else {
      message = 'Related resource not found';
    }
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
