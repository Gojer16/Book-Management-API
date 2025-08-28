'use client';
import GenreBadge from './GenreBadge';
import React, { useRef, useState } from 'react';
import { Book, NewBook } from '../hooks/useBooks';
import { useForm } from '../hooks/useFormBooks';

type EditBookFormData = {
  title: string;
  author: string;
  publicationYear: string;
  genre: string;
  description: string;
  tags?: string[];
  rating?: number;
  isbn?: string;
};
import Image from 'next/image';
import { useImageUpload } from '../hooks/useImageHander';

interface BooksProps {
  books: Book[];
  deleteBook: (id: string) => Promise<void>;
  editBook: (id: string, updatedBook: NewBook) => Promise<void>;
  fetchBooks: () => Promise<void>;
  layout?: 'list' | 'grid';
}

const Books: React.FC<BooksProps> = (props: BooksProps) => {
  const { books, deleteBook, editBook, fetchBooks, layout = 'list' } = props;
  const { formData: editingBookData, handleChange: handleEditChange, setFormData: setEditingBookData } = useForm({
    title: '',
    author: '',
    publicationYear: '',
    genre: '',
    description: '',
    tags: [],
    rating: undefined,
    isbn: '',
  });

  const [editingBookId, setEditingBookId] = useState<string | null>(null);
  const [tagsInput, setTagsInput] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadImage, isUploading, uploadError, clearError } = useImageUpload();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      setSelectedFile(file);

      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const submitEdit = async (id: string) => {
    await editBook(id, editingBookData);
    if (selectedFile) {
      await uploadImage(selectedFile, id);
      setSelectedFile(null);
      setPreviewUrl('');
    }
    await fetchBooks();
    setEditingBookId(null);
  };

  if (books.length === 0) {
    return <p className="book-manager__empty">No books found. Start adding some!</p>;
  }

  return (
    <ul className={`book-manager__list ${layout === 'grid' ? 'book-manager__list--grid' : 'book-manager__list--list'}`}>
  {books.map((book: Book) => (
        <li key={book._id} className="book-card">
          {editingBookId === book._id ? (
            <div className="book-card__edit-form">
              <input type="text" name="title" value={editingBookData.title} onChange={handleEditChange} placeholder="Title" className="book-card__input" />
              <input type="text" name="author" value={editingBookData.author} onChange={handleEditChange} placeholder="Author" className="book-card__input" />
              <input type="number" name="publicationYear" value={editingBookData.publicationYear} onChange={handleEditChange} placeholder="Year" className="book-card__input" />
              <input type="text" name="genre" value={editingBookData.genre} onChange={handleEditChange} placeholder="Genre" className="book-card__input" />
              <textarea name="description" value={editingBookData.description} onChange={handleEditChange} placeholder="Description" className="book-card__input book-card__textarea" />

              <label htmlFor="edit-tags">Tags</label>
              <input
                type="text"
                id="edit-tags"
                name="tags"
                value={tagsInput}
                placeholder="Tags (comma separated)"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTagsInput(e.target.value)}
                onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                  const inputValue = e.target.value.trim();
                  if (inputValue) {
                    const tags = inputValue.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag);
                    setEditingBookData({
                      ...editingBookData,
                      tags,
                    });
                  } else {
                    setEditingBookData({
                      ...editingBookData,
                      tags: [],
                    });
                  }
                }}
                onFocus={() => {
                  if (Array.isArray(editingBookData.tags) && editingBookData.tags.length > 0) {
                    setTagsInput(editingBookData.tags.join(', '));
                  }
                }}
                className="book-card__input"
              />

              <label htmlFor="edit-rating">Rating</label>
              <input
                type="number"
                id="edit-rating"
                name="rating"
                min="1"
                max="10"
                step="0.1"
                value={editingBookData.rating ?? ''}
                placeholder="Rating (1-10)"
                onChange={handleEditChange}
                className="book-card__input"
              />

              <label htmlFor="edit-isbn">ISBN</label>
              <input
                type="text"
                id="edit-isbn"
                name="isbn"
                value={editingBookData.isbn ?? ''}
                placeholder="ISBN"
                onChange={handleEditChange}
                className="book-card__input"
              />

              <label htmlFor="edit-coverImage">Cover Image</label>
              <div className="image-upload-container">
                <input
                  type="file"
                  id="edit-coverImage"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />

                {previewUrl ? (
                  <div className="image-preview">
                    <Image src={previewUrl} alt="Preview" width={160} height={224} unoptimized />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="remove-image-btn"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="upload-btn"
                  >
                    {isUploading ? 'Uploading...' : 'Choose Image'}
                  </button>
                )}

                {uploadError && (
                  <div className="upload-error">
                    {uploadError}
                    <button onClick={clearError}>×</button>
                  </div>
                )}
              </div>
              
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
                {book.coverUrl ? (
                  <Image width={100} height={100} src={book.coverUrl} alt={`${book.title} cover`} className="book-card__cover" />
                ) : (
                  <div className="book-card__cover book-card__cover--fallback" aria-label="No cover available" />
                )}
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
                      tags: book.tags || [],
                      rating: book.rating,
                      isbn: book.isbn || '',
                    });
                    setSelectedFile(null);
                    setPreviewUrl('');
                    setTagsInput(Array.isArray(book.tags) ? book.tags.join(', ') : '');
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
