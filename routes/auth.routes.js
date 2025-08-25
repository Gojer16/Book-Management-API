const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validate, registerSchema, loginSchema } = require('../middleware/validation');

/**
 * @swagger
 * tags:
 *   - name: "Authentication"
 *     description: "User authentication and registration"
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: "Register a new user"
 *     tags: ["Authentication"]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/UserCredentials"
 *     responses:
 *       201:
 *         description: "User registered successfully"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuthToken"
 *       400:
 *         description: "User already exists or Validation Error"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ValidationError"
 *       500:
 *         description: "Internal Server Error"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 */
router.post(
  '/register',
  validate(registerSchema, 'body'),
  authController.register
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: "Log in an existing user"
 *     tags: ["Authentication"]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/UserCredentials"
 *     responses:
 *       200:
 *         description: "User logged in successfully"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuthToken"
 *       400:
 *         description: "Invalid credentials or Validation Error"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ValidationError"
 *       500:
 *         description: "Internal Server Error"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 */
router.post(
  '/login',
  validate(loginSchema, 'body'),
  authController.login
);

router.post(
  '/refresh',

  authController.refresh
);

router.post(
  '/logout',
  authController.logout
);



module.exports = router;