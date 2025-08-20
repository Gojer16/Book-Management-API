const mongoose = require('mongoose');

const UserLibrarySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  status: {
    type: String,
    enum: ['to-read', 'reading', 'paused', 'finished'],
    default: 'to-read'
  },
  addedAt: {
    type: Date,
    default: Date.now
  },
  rating: {
    type: Number,
    min: 0,
    max: 10
  },
  notes: {
    type: String,
    maxlength: 1000
  }
}, { timestamps: true });

UserLibrarySchema.index({ user: 1, book: 1 }, { unique: true });

module.exports = mongoose.model('UserLibrary', UserLibrarySchema);
