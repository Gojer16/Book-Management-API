import React, { useState, useRef } from 'react';
import { NewBook, Book } from '../hooks/useBooks';
import { useImageUpload } from '../hooks/useImageHander';
import "./addBook.css";
import { genreColors } from '../constants/genreColors';
import Image from 'next/image';

interface AddBookProps {
  newBook: NewBook;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  addBookSubmit: () => Promise<Book | null>;
  onBookCreated?: (bookId: string) => void;
}

const AddBook: React.FC<AddBookProps> = ({ newBook, handleInputChange, addBookSubmit}) => {
  const [showModal, setShowModal] = useState<boolean>(false);
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

  const handleSubmit = async () => {
    if (!newBook.title.trim() || !newBook.author.trim() || !newBook.genre.trim()) {
      alert('Please fill in all required fields: Title, Author, and Genre');
      return;
    }

    const result = await addBookSubmit();
    
    if (selectedFile && result && result._id) {
      try {
        await uploadImage(selectedFile, result._id);
        setSelectedFile(null);
        setPreviewUrl('');
      } catch (error) {
        console.error('Failed to upload image:', error);
      }
    }
    
    setShowModal(false);
  };

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

              <label htmlFor="author">Author *</label>
                <input
                type="text"
                id="author"
                name="author"
                value={newBook.author}
                placeholder="Author *"
                onChange={handleInputChange}
                required
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

              <label htmlFor="genre">Genre *</label>
                <select
                name="genre"
                value={newBook.genre}
                onChange={handleInputChange}
                className="book-card__input"
                required
                >
                <option value="">Select Genre *</option>
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

              <label htmlFor="tags">Tags</label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={tagsInput}
                placeholder="Tags (comma separated)"
                onChange={(e) => {
                  const inputValue = e.target.value;
                  setTagsInput(inputValue);
                }}
                onBlur={(e) => {
                  const inputValue = e.target.value.trim();
                  if (inputValue) {
                    const tags = inputValue.split(',').map(tag => tag.trim()).filter(tag => tag);
                    const customEvent = {
                      target: {
                        name: 'tags',
                        value: tags
                      }
                    } as any;
                    handleInputChange(customEvent);
                  } else {
                    const customEvent = {
                      target: {
                        name: 'tags',
                        value: []
                      }
                    } as any;
                    handleInputChange(customEvent);
                  }
                }}
                onFocus={() => {
                  if (Array.isArray(newBook.tags) && newBook.tags.length > 0) {
                    setTagsInput(newBook.tags.join(', '));
                  }
                }}
              />

              <label htmlFor="rating">Rating</label>
              <input
                type="number"
                id="rating"
                name="rating"
                min="1"
                max="10"
                step="0.1"
                value={newBook.rating}
                placeholder="Rating (1-10)"
                onChange={handleInputChange}
              />

              <label htmlFor="isbn">ISBN</label>
              <input
                type="text"
                id="isbn"
                name="isbn"
                value={newBook.isbn}
                placeholder="ISBN"
                onChange={handleInputChange}
              />

              <label htmlFor="coverImage">Cover Image</label>
              <div className="image-upload-container">
                <input
                  type="file"
                  id="coverImage"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />
                
                {previewUrl ? (
                  <div className="image-preview">
                    <Image src={previewUrl} alt="Preview" />
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

            </div>
            <div className="modal-actions">
                <button onClick={handleSubmit} className="btn btn--save"
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
