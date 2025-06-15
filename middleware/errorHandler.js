const mongoose = require('mongoose');

const errorHandler = (err, req, res, next) => {
    // Log the full error for server-side debugging (do not send full stack in production)
    console.error('--- CENTRALIZED ERROR HANDLER ---');
    console.error(err);
    console.error('---------------------------------');

    // Default status code and message
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Something went wrong on the server.';
    let errors = []; // To hold detailed validation errors or other specific error details

    // Handle Joi validation errors (from your validation.js middleware)
    if (err.isJoi) { // Custom flag added in your validation.js
        statusCode = 400; // Bad Request
        message = 'Validation Error';
        errors = err.details.map(detail => ({
            field: detail.context.key,
            message: detail.message
        }));
    }

    // Handle Mongoose specific errors
    if (err.name === 'CastError') { // e.g., invalid ObjectId format in URL params
        statusCode = 400;
        message = `Invalid format for ${err.path}: ${err.value}`;
    } else if (err.name === 'ValidationError') { // Mongoose model validation errors (e.g., required field missing in model)
        statusCode = 400;
        message = 'Validation failed';
        // Extract messages from Mongoose ValidationError errors object
        for (let field in err.errors) {
            errors.push({
                field: field,
                message: err.errors[field].message
            });
        }
    } else if (err.code && err.code === 11000) { // MongoDB duplicate key error (e.g., unique: true ISBN)
        statusCode = 409; // Conflict
        const field = Object.keys(err.keyValue)[0];
        message = `A document with this ${field} already exists.`;
        errors.push({ field: field, value: err.keyValue[field] });
    }
    // Handle unauthorized errors from auth middleware if it sets a specific status or message
    if (err.name === 'UnauthorizedError' || err.message === 'No token, authorization denied' || err.message === 'Token is not valid') {
         statusCode = 401; // Unauthorized
         message = err.message;
    }


    // Generic error response
    res.status(statusCode).json({
        success: false,
        message: message,
        errors: errors.length > 0 ? errors : undefined, // Only include if there are specific errors
        // In production, avoid sending detailed error stack traces
        stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
    });
};

module.exports = errorHandler; // Export it