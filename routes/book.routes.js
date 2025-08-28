const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const { validate, createBookSchema, updateBookSchema, searchBooksSchema, idSchema } = require('../middleware/validation');
const upload = require('../middleware/upload');
const authorizeRole = require("../middleware/authorizeRole");

/**
 * @swagger
 * tags:
 *   - name: "Books"
 *     description: "Book management operations"
 */

/**
 * @swagger
 * /books:
 *   post:
 *     summary: "Create a new book"
 *     tags: ["Books"]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - author
 *               - genre
 *             properties:
 *               title:
 *                 type: string
 *                 example: "The Hitchhiker's Guide to the Galaxy"
 *               author:
 *                 type: string
 *                 example: "Douglas Adams"
 *               publicationYear:
 *                 type: integer
 *                 example: 1979
 *               genre:
 *                 type: string
 *                 example: "Science Fiction"
 *               description:
 *                 type: string
 *                 example: "A comedic science fiction series."
 *     responses:
 *       201:
 *         description: "Book created successfully"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Book"
 *       400:
 *         description: "Validation Error"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ValidationError"
 *       401:
 *         description: "Unauthorized, no token or invalid token"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UnauthorizedError"
 *       409:
 *         description: "Conflict, e.g., unique field already exists (like ISBN if you add it)"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 *       500:
 *         description: "Internal Server Error"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 */
router.post(
    '/',
    authorizeRole('Admin'),
    validate(createBookSchema, 'body'),
    bookController.createBook
);

/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: "Retrieve a single book by ID"
 *     tags: ["Books"]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: ObjectId
 *         description: "The ID of the book to retrieve."
 *     responses:
 *       200:
 *         description: "A single book object."
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Book"
 *       400:
 *         description: "Invalid ID format (e.g., not an ObjectId)"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ValidationError"
 *       401:
 *         description: "Unauthorized, no token or invalid token"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UnauthorizedError"
 *       404:
 *         description: "Book not found"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/NotFoundError"
 *       500:
 *         description: "Internal Server Error"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 */
router.get(
    '/:id',
    authorizeRole('Admin', 'Reader', 'User'),
    validate(idSchema, 'params'),
    bookController.getBookById
);

/**
 * @swagger
 * /books/{id}:
 *   put:
 *     summary: "Update an existing book by ID"
 *     tags: ["Books"]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: ObjectId
 *         description: "The ID of the book to update."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "The Restaurant at the End of the Universe"
 *               author:
 *                 type: string
 *                 example: "Douglas Adams"
 *               publicationYear:
 *                 type: integer
 *                 example: 1980
 *               genre:
 *                 type: string
 *                 example: "Science Fiction"
 *               description:
 *                 type: string
 *                 example: "The second book in the Hitchhiker's Guide to the Galaxy series."
 *     responses:
 *       200:
 *         description: "Book updated successfully"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Book"
 *       400:
 *         description: "Validation Error or Invalid ID format"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ValidationError"
 *       401:
 *         description: "Unauthorized, no token or invalid token"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UnauthorizedError"
 *       404:
 *         description: "Book not found"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/NotFoundError"
 *       409:
 *         description: "Conflict, e.g., unique field already exists"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 *       500:
 *         description: "Internal Server Error"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 */
router.put(
    '/:id',
    authorizeRole('Admin'),
    validate(idSchema, 'params'),
    validate(updateBookSchema, 'body'),
    bookController.updateBook
);

/**
 * @swagger
 * /books/{id}:
 *   delete:
 *     summary: "Delete a book by ID"
 *     tags: ["Books"]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: ObjectId
 *         description: "The ID of the book to delete."
 *     responses:
 *       200:
 *         description: "Book deleted successfully"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Book deleted successfully"
 *       400:
 *         description: "Invalid ID format"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ValidationError"
 *       401:
 *         description: "Unauthorized, no token or invalid token"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UnauthorizedError"
 *       404:
 *         description: "Book not found"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/NotFoundError"
 *       500:
 *         description: "Internal Server Error"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 */
router.delete(
    '/:id',
    authorizeRole('Admin'),
    validate(idSchema, 'params'),
    bookController.deleteBook
);


router.get(
    '/',
    authorizeRole('Admin', 'Reader', 'User'),
    validate(searchBooksSchema, 'query'),
    bookController.searchBooks
);

router.post(
    '/:id/upload-cover',
    authorizeRole('Admin'),
    upload.single('cover'),
    bookController.uploadCover
);


module.exports = router;