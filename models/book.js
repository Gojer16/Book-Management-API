const mongoose = require('mongoose');

const Book = mongoose.models.Book || mongoose.model('Book', new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required.'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters.']
  },
  author: {
    type: String,
    trim: true,
    required: [true, 'Author is required.']
  },
  publicationYear: {
    type: Number,
    min: [1000, 'Year must be after 1000'],
    max: [new Date().getFullYear(), 'Year cannot be in the future.']
  },
  genre: {
    type: String,
    trim: true,
    required: [true, 'Genre is required.'],
    maxlength: [100, 'Genre cannot exceed 100 characters.']
  },
  tags: {
    type: [String],
    validate: {
      validator: arr => arr.every(tag => tag.length <= 100),
      message: 'Each tag cannot exceed 100 characters.'
    },
  },
  rating: {
    type: Number,
    min: [0, 'Rating cannot be less than 0.'],
    max: [10, 'Rating cannot exceed 10'],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters.']
  },
   isbn: {
    type: String,
    unique: true,
    sparse: true,
    match: [/^(97(8|9))?\d{9}(\d|X)$/, 'ISBN must be a valid 10 or 13 digit number.']
  },
  coverUrl: { type: String },
  
}, { timestamps: true }));

module.exports = Book;













