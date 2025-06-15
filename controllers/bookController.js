const Book = require('../models/book'); 
const mongoose = require('mongoose'); 

/** 
*@desc Create a book
*@route POST /api/books
*@access Public (or Private)
*/
exports.createBook = async (req, res, next) => {
    try {
        const newBook = await Book.create(req.body);
        res.status(201).json(newBook);
    } catch (err) {
        if (err.code === 11000) { 
            return res.status(409).json({ message: 'A book with this unique field already exists.' });
        }
        next(err); 
    }
};

// @desc Get all books
// @route GET /api/books
// @access Public
exports.getBooks = async (req, res, next) => {
    try {
        const books = await Book.find();
        res.status(200).json(books);
    } 
    catch (err) 
    {
        next(err);
    }
};

// @desc Get a single book
// @route GET /api/books/:id
// @access Public
exports.getBookById = async (req, res, next) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(200).json(book);
    } catch (err) {
        if (err instanceof mongoose.Error.CastError) 
            {
             return res.status(400).json({ message: 'Invalid Book ID format.' });
        }
        next(err);
    }
};

// @desc Update a book
// @route PUT /api/books/:id
// @access Public (or Private)
exports.updateBook = async (req, res, next) => {
    try {
        const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedBook) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(200).json(updatedBook);
    } catch (err) {
        if (err.code === 11000) { 
            return res.status(409).json({ message: 'A book with this unique field (e.g., ISBN) already exists.' });
        }
        if (err.name === 'ValidationError') 
            {
            return res.status(400).json({ message: err.message });
        }
        next(err);
    }
};

// @desc Delete a book
// @route DELETE /api/books/:id
// @access Public (or Private)
exports.deleteBook = async (req, res, next) => {
    try {
        const deletedBook = await Book.findByIdAndDelete(req.params.id);
        if (!deletedBook) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(200).json({ message: 'Book deleted successfully' });
    } catch (err) {
        if (err instanceof mongoose.Error.CastError) 
            {
             return res.status(400).json({ message: 'Invalid Book ID format.' });
        }
        next(err);
    }
};

module.exports 