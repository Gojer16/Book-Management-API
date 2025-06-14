const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const { validate, createBookSchema, updateBookSchema, idSchema } = require('../middleware/validation');

router.post(
    '/',
    validate(createBookSchema, 'body'),
    bookController.createBook 
);

router.get(
    '/',
    bookController.getBooks
);

router.get(
    '/:id',
    validate(idSchema, 'params'),
    bookController.getBookById 
);

router.put(
    '/:id',
    validate(idSchema, 'params'),
    validate(updateBookSchema, 'body'),
    bookController.updateBook 
);

router.delete(
    '/:id',
    validate(idSchema, 'params'),
    bookController.deleteBook 
);

module.exports = router;