const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validate, registerSchema, loginSchema } = require('../middleware/validation');

router.post(
  '/register',
  validate(registerSchema, 'body'), 
  authController.register
);

router.post(
  '/login',
  validate(loginSchema, 'body'), 
  authController.login
);

module.exports = router;