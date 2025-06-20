const Joi = require('joi');
const mongoose = require('mongoose')

const registerSchema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'org', 'es', 'io', 'dev'] } }) 
    .required()
    .messages({
      'string.email': 'Email must be a valid email address.',
      'string.empty': 'Email cannot be empty.',
      'any.required': 'Email is required.'
    }),
  password: Joi.string()
    .min(8) 
    .max(30) 
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,30}$/)
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters long.',
      'string.max': 'Password cannot exceed 30 characters.',
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*()_+).',
      'string.empty': 'Password cannot be empty.',
      'any.required': 'Password is required.'
    }),
});

const loginSchema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'org', 'es', 'io', 'dev'] } })
    .required()
    .messages({
      'string.email': 'Email must be a valid email address.',
      'string.empty': 'Email cannot be empty.',
      'any.required': 'Email is required.'
    }),
  password: Joi.string()
    .required()
    .messages({
      'string.empty': 'Password cannot be empty.',
      'any.required': 'Password is required.'
    }),
});

//Books schemas
const createBookSchema = Joi.object({
  title: Joi.string().min(1).max(255)
  .required()
  .messages({
    'string.min': 'Title must not be empty.',
    'string.max': 'Title cannot exceed 255 characters.',
    'any.required': 'Title is required.'
  }),
  author: Joi.string().min(1).max(255)
  .optional()
  .messages({
    'string.min': 'Author must not be empty.',
    'string.max': 'Author cannot exceed 255 characters.',
    'any.required': 'Author is required.'
  }),
  publicationYear: Joi.number().integer().min(1000).max(new Date().getFullYear() + 5) 
    .optional()
    .messages({
      'number.base': 'Publication year must be a number.',
      'number.integer': 'Publication year must be an integer.',
      'number.min': 'Publication year cannot be before 1000.',
      'number.max': `Publication year cannot be after ${new Date().getFullYear() + 5}.`,
      'any.required': 'Publication year is required.'
    }),
  genre: Joi.string().min(1).max(100)
  .optional()
  .messages({
    'string.min': 'Genre must not be empty if provided.',
    'string.max': 'Genre cannot exceed 100 characters.'
  }),
  description: Joi.string().max(1000)
  .optional()
  .messages({
    'string.max': 'Description cannot exceed 1000 characters.'
  }),
});

const updateBookSchema = Joi.object({
  title: Joi.string().min(1).max(255)
  .optional()
  .messages({
    'string.min': 'Title must not be empty.',
    'string.max': 'Title cannot exceed 255 characters.'
  }),
  author: Joi.string().min(1).max(255)
  .optional()
  .messages({
    'string.min': 'Author must not be empty.',
    'string.max': 'Author cannot exceed 255 characters.'
  }),
  isbn: Joi.string().pattern(/^(?:ISBN(?:-13)?:?)(?=[0-9]{13}$)([0-9]{3}-){2}[0-9]{3}[0-9X]$/)
  .optional()
  .messages({
    'string.pattern.base': 'ISBN must be a valid 13-digit ISBN (e.g., 978-3-16-148410-0).'
  }),
  publicationYear: Joi.number().integer().min(1000).max(new Date().getFullYear() + 5)
  .optional()
  .messages({
    'number.base': 'Publication year must be a number.',
    'number.integer': 'Publication year must be an integer.',
    'number.min': 'Publication year cannot be before 1000.',
    'number.max': `Publication year cannot be after ${new Date().getFullYear() + 5}.`
  }),
  genre: Joi.string().min(1).max(100)
  .optional()
  .messages({
    'string.min': 'Genre must not be empty if provided.',
    'string.max': 'Genre cannot exceed 100 characters.'
  }),
  description: Joi.string().max(1000)
  .optional()
  .messages({
    'string.max': 'Description cannot exceed 1000 characters.'
  }),
});


const idSchema = Joi.object({ 
  id: Joi.string().custom((value, helpers) => { 
    const ObjectId = mongoose.Types.ObjectId;

    if (!ObjectId || !ObjectId.isValid(value)) {
        return helpers.error('any.invalid'); 
    }
    return value;
  }).messages({
    'any.invalid': 'Invalid ID format.'
  }).required() 
});

/**
 * Creates a middleware function to validate request data against a Joi schema.
 * @param {Joi.Schema} schema - The Joi schema to validate against.
 * @param {string} property - The property of the request object to validate ('body', 'query', 'params').
 * @returns {Function} Express middleware function.
 */
const validate = (schema, property) => (req, res, next) => {
    const { error } = schema.validate(req[property], { abortEarly: false });
    if (error) {
        const validationError = new Error('Validation Error');
        validationError.statusCode = 400;
        validationError.isJoi = true;
        validationError.details = error.details;
        return next(validationError);
    }
    next();
};

module.exports = {
  registerSchema,
  loginSchema,
  createBookSchema,
  updateBookSchema,
  idSchema, 
  validate,
};