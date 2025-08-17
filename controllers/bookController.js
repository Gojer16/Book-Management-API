const Book = require('../models/book'); 
const mongoose = require('mongoose'); 
const cloudinary = require('../config/cloudinary');
const upload = require('../middleware/upload');
const streamifier = require('streamifier');

/** 
*@desc Create a book
*@route POST /api/books
*@access Private
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
// @access Private
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
// @access Private
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
// @access Private
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
// @access Private
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


// @desc search/filter/sort
// @route GET /api/books/
// @access Private
exports.searchBooks = async (req, res, next) => {
  try {
    const {
      title,
      author,
      genre,
      tags,
      publicationYear,
      rating,
      sort = 'title',
      order = 'asc',
      page = 1,
      limit = 20
    } = req.query;

    let query = {};
    if (title) query.title = { $regex: title, $options: 'i' };
    if (author) query.author = { $regex: author, $options: 'i' };
    if (genre) {
    query.genre = { $regex: `^${genre.trim()}$`, $options: 'i' };
    }
    if (publicationYear) query.publicationYear = Number(publicationYear);
    if (rating) query.rating = Number(rating);
    // Tags
    if (tags) {
    const tagsArray = Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim());

    query.tags = { 
    $elemMatch: { $regex: tagsArray.join('|'), $options: 'i' } 
    };
    }
    // Pagination
    const skip = (Number(page) - 1) * Number(limit);
    // Sorting
    const sortOrder = order === 'desc' ? -1 : 1;
    const sortObj = { [sort]: sortOrder };

    const books = await Book.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(Number(limit));

    const total = await Book.countDocuments(query);

    res.json({
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      results: books
    });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

exports.uploadCover = async (req, res, next) => {
    try {
        const bookId = req.params.id
        if (!req.file) {
            return res.status(400).json({
                message: "No file uploaded."
            })
        }

        const result = await cloudinary.uploader.upload_stream({
            folder: 'book_covers',
            width: 200,
            height: 300,
            crop: 'scale',
        },

        async (error, uploadResult) => {
            if (error) return res.status(500).json({
                message: error.message
            })
        const book = await Book.findByIdAndUpdate(
            bookId,
            {coverUrl: uploadResult.secure_url},
            {new: true}
        )

        res.json({
            message: "Cover uploaded successfully",
            book
        })})

    streamifier.createReadStream(req.file.buffer).pipe(result)
    } 
    catch (error)
     {
    res.status(500).json({
        message: error.message
    })    
    }
}

module.exports 