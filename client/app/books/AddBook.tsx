import React, { useState } from 'react';
import { NewBook } from '../hooks/useBooks';
import "./addBook.css";
import { genreColors } from '../constants/genreColors';

interface AddBookProps {
  newBook: NewBook;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  addBookSubmit: () => void;
}

const AddBook: React.FC<AddBookProps> = ({ newBook, handleInputChange, addBookSubmit }) => {
  const [showModal, setShowModal] = useState<boolean>(false);

  return (
    <div>
      <button 
      className="fab" 
      onClick={() => setShowModal(true)}
      >
        +
    </button>

      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Add a New Book</h2>
            <div className="modal-fields">
              <label htmlFor="title">Title *</label>
                <input
                type="text"
                id="title"
                name="title"
                value={newBook.title}
                placeholder="Title *"
                onChange={handleInputChange}
                required
              />

              <label htmlFor="author">Author</label>
                <input
                type="text"
                id="author"
                name="author"
                value={newBook.author}
                placeholder="Author"
                onChange={handleInputChange}
              />

              <label htmlFor="publicationYear">Year</label>
                <input
                  type="number"
                  id="publicationYear"
                  name="publicationYear"
                  value={newBook.publicationYear}
                  placeholder="Publication Year"
                  onChange={handleInputChange}
                />

              <label htmlFor="genre">Genre</label>
                <select
                name="genre"
                value={newBook.genre}
                onChange={handleInputChange}
                className="book-card__input"
                >
                <option value="">Select Genre</option>
                {Object.keys(genreColors).map((g) => (
                <option key={g} value={g}>{g}</option>
                ))}
                </select>

              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={newBook.description}
                placeholder="Description"
                onChange={handleInputChange}
              />

            </div>
            <div className="modal-actions">
                <button onClick={() => { addBookSubmit(); setShowModal(false); }} className="btn btn--save"
                >
                Add Book
                </button>
                <button onClick={() => setShowModal(false)} className="btn btn--cancel"
                >
                Cancel
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AddBook;
