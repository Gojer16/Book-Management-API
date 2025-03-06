const mongoose = require('mongoose');

const errorHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = 'Internal Server Error';

  // Handle Mongoose errors
  if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = 'Invalid ID format';
  } else if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = Object.values(err.errors).map(val => val.message).join(', ');
  } else if (err.code === 11000) {
    statusCode = 400;
    message = 'Duplicate field value entered';
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired, please log in again';
  }

  // Handle custom errors
  if (err.statusCode) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // Log the error for debugging
  console.error(err.stack);

  // Send response
  res.status(statusCode).json({
    success: false,
    error: message
  });
};

module.exports = errorHandler;
