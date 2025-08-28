const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middleware/auth");
const { addBookToLibrary, removeBookFromLibrary, listUserLibrary } = require("../controllers/userLibraryController");
const authorizeRole = require("../middleware/authorizeRole");
const { validate } = require("../middleware/validation");

router.post(
    "/:bookId",
    isAuthenticated,
    authorizeRole('Admin', 'Reader'),
    addBookToLibrary
);

router.delete(
  "/:bookId",
  isAuthenticated,
  authorizeRole("Admin", "Reader"),
  removeBookFromLibrary
);

router.get(
  "/",
  isAuthenticated,
  authorizeRole("Admin", "Reader"),
  listUserLibrary
);

module.exports = router;