'use client';
import GenreBadge from './GenreBadge';
import React, { useState } from 'react';
import { Book, NewBook } from '../hooks/useBooks';
import { useForm } from '../hooks/useFormBooks';

interface BooksProps {
  books: Book[];
  deleteBook: (id: string) => Promise<void>;
  editBook: (id: string, updatedBook: NewBook) => Promise<void>;
}

const Books: React.FC<BooksProps> = ({ books, deleteBook, editBook }) => {
  const { formData: editingBookData, handleChange: handleEditChange, setFormData: setEditingBookData } = useForm({
    title: '',
    author: '',
    publicationYear: '',
    genre: '',
    description: '',
  });

  const [editingBookId, setEditingBookId] = useState<string | null>(null);

  const submitEdit = async (id: string) => {
    await editBook(id, editingBookData);
    setEditingBookId(null);
  };

  if (books.length === 0) {
    return <p className="book-manager__empty">No books found. Start adding some!</p>;
  }

  return (
    <ul className="book-manager__list">
      {books.map((book) => (
        <li key={book._id} className="book-card">
          {editingBookId === book._id ? (
            <div className="book-card__edit-form">
              <input type="text" name="title" value={editingBookData.title} onChange={handleEditChange} placeholder="Title" className="book-card__input" />
              <input type="text" name="author" value={editingBookData.author} onChange={handleEditChange} placeholder="Author" className="book-card__input" />
              <input type="number" name="publicationYear" value={editingBookData.publicationYear} onChange={handleEditChange} placeholder="Year" className="book-card__input" />
              <input type="text" name="genre" value={editingBookData.genre} onChange={handleEditChange} placeholder="Genre" className="book-card__input" />
              <textarea name="description" value={editingBookData.description} onChange={handleEditChange} placeholder="Description" className="book-card__input book-card__textarea" />
              
              <div className="book-card__actions">
                <button onClick={() => submitEdit(book._id)} className="btn btn--save">Save</button>
                <button onClick={() => setEditingBookId(null)} className="btn btn--cancel">Cancel</button>
              </div>
            </div>
          ) : (
            <div className="book-card__view">
              <div className="book-card__info">
                <h3 className="book-card__title">{book.title}</h3>
                {book.author && <p className="book-card__author">by {book.author}</p>}
                {book.publicationYear && <span className="book-card__year">{book.publicationYear}</span>}
                {book.genre && <GenreBadge genre={book.genre} />}
                {book.description && <p className="book-card__description">{book.description}</p>}
                {book.tags && <p className="book-card__tags">{book.tags.join(', ')}</p>}
                {book.rating && <p className="book-card__rating">Rating: {book.rating}</p>}
                {book.coverUrl && <img src={book.coverUrl} alt={`${book.title} cover`} className="book-card__cover" />}
                {book.isbn && <p className="book-card__isbn">ISBN: {book.isbn}</p>}
              </div>
              <div className="book-card__actions">
                <button
                  onClick={() => {
                    setEditingBookId(book._id);
                    setEditingBookData({
                      title: book.title,
                      author: book.author || '',
                      publicationYear: book.publicationYear?.toString() || '',
                      genre: book.genre || '',
                      description: book.description || '',
                    });
                  }}
                  className="btn btn--edit"
                >
                  Edit
                </button>
                <button onClick={() => deleteBook(book._id)} className="btn btn--delete">Delete</button>
              </div>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

export default Books;
