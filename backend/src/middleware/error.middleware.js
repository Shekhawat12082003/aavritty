import { validationResult } from 'express-validator';
import { ApiError } from '../utils/ApiError.js';
import logger from '../utils/logger.js';

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formatted = errors.array().map((e) => ({ field: e.path, message: e.msg }));
    return next(new ApiError(422, 'Validation failed', formatted));
  }
  next();
};

export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  if (err.code === 'P2002') {
    statusCode = 409;
    message = 'Resource already exists';
  }

  if (err.code === 'P2025') {
    statusCode = 404;
    message = 'Resource not found';
  }

  logger.error(`${statusCode} - ${message}`, {
    path: req.originalUrl,
    method: req.method,
    stack: err.stack,
  });

  res.status(statusCode).json({
    success: false,
    message,
    errors: err.errors || null,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export const notFound = (req, res, next) => {
  next(new ApiError(404, `Route ${req.originalUrl} not found`));
};
