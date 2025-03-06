const express = require('express');
const Book = require('./models/book');
const router = express.Router();

// @desc Create a book
// @route POST /api/books
// @access Public
router.post('/', async (req, res) => {
    try {
        const newBook = await Book.create(req.body);
        res.status(201).json(newBook); // ✅ Fix: Use newBook instead of Book
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// @desc Get all books
// @route GET /api/books
// @access Public
router.get('/', async (req, res) => {
    try {
        const books = await Book.find(); // ✅ Fix: Use books instead of newBook
        res.status(200).json(books); // ✅ Fix: Use books instead of Book
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @desc Get a single book
// @route GET /api/books/:id
// @access Public
router.get('/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) { // ✅ Fix: Check if book is null
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(200).json(book); // ✅ Fix: Use book instead of Book
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @desc Update a book
// @route PUT /api/books/:id
// @access Public
router.put('/:id', async (req, res) => {
    try {
        const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedBook) { // ✅ Fix: Check if updatedBook is null
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(200).json(updatedBook); // ✅ Fix: Use updatedBook instead of Book
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// @desc Delete a book
// @route DELETE /api/books/:id
// @access Public
router.delete('/:id', async (req, res) => {
    try {
        const deletedBook = await Book.findByIdAndDelete(req.params.id);
        if (!deletedBook) { // ✅ Fix: Check if deletedBook is null
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(200).json({ message: 'Book deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
