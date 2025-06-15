const mongoose = require('mongoose');

const Book = mongoose.models.Book || mongoose.model('Book', new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  author: {
    type: String,
    trim: true
  },
  publicationYear: {
    type: Number,
    min: [1000, 'Year must be after 1000'],
    max: [new Date().getFullYear(), 'Year cannot be in the future']
  },
  genre: {
    type: String,
    trim: true,
    maxlength: [100, 'Genre cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  }
}, { timestamps: true }));

module.exports = Book;













