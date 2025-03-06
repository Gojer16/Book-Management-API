const mongoose = require('mongoose');

// Check if the model already exists
const Book = mongoose.models.Book || mongoose.model('Book', new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  author: {
    type: String,
    required: [true, 'Author is required'],
    trim: true
  },
  publishedYear: {
    type: Number,
    required: [true, 'Published year is required'],
    min: [1000, 'Year must be after 1000'],
    max: [new Date().getFullYear(), 'Year cannot be in the future']
  }
}, { timestamps: true }));

module.exports = Book;