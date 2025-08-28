const UserLibrary = require("../models/userLibrary");
const Book = require("../models/book");

const addBookToLibrary = async (req, res) => {
  try {
    const { bookId } = req.params;
    const { status, rating, notes } = req.body;
    const userId = req.user.id; 

    const bookExists = await Book.findById(bookId);
    if (!bookExists) {
      return res.status(404).json({ 
        message: "Book not found" 
    });
    }

    const newEntry = await UserLibrary.create({
      user: userId,
      book: bookId,
      status: status || "to-read",
      rating,
      notes,
    });

    res.status(201).json({
      message: "Book added to library",
      libraryEntry: newEntry,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ 
        message: "Book already in your library" 
    });
    }
    res.status(500).json({ 
        message: "Server error", error: err.message 
    });
  }
};

const removeBookFromLibrary = async (req, res) => {
  try {
    const { bookId } = req.params;
    const userId = req.user.id; 

    const deletedEntry = await UserLibrary.findOneAndDelete({
      user: userId,
      book: bookId
    });

    if (!deletedEntry) {
      return res.status(404).json({ 
        message: "Book not found in your library" 
    });
    }

    res.status(200).json({
      message: "Book removed from library",
      removed: deletedEntry
    });
  } catch (err) {
    res.status(500).json({ 
        message: "Server error", error: err.message 
    });
  }
};

const listUserLibrary = async (req, res) => {
  try {
    const userId = req.user.id; 

    const library = await UserLibrary.find({ user: userId })
      .populate("book", "title author publishedYear genre") 
      .sort({ addedAt: -1 }); 

    res.status(200).json({
      count: library.length,
      library
    });
  } catch (err) {
    res.status(500).json({ 
        message: "Server error", error: err.message 
    });
  }
};

module.exports = {
    addBookToLibrary,
    removeBookFromLibrary,
    listUserLibrary
};
