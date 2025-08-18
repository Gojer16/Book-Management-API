'use client';
import React from 'react'
import "./page.css";
import { useBooks } from '../hooks/useBooks';
import { useForm } from '../hooks/useFormBooks';
import AddBook from './AddBook';
import Books from './Books';


const Page = () => {
    const { books, loading, error, addBook, deleteBook, editBook } = useBooks();
    const { formData: newBook, handleChange: handleInputChange, resetForm } = useForm({
    title: "",
    author: "",
    publicationYear: "",
    genre: "",
    description: "",
    tags: [],
    rating: undefined,
    coverUrl: undefined,
    isbn: undefined,
  });

  if (loading) return <p>Loading books...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;


  return (
    <> 
      <main className="book-manager">
        <h1 className="book-manager__title">My Books</h1>
        <Books 
        books={books} 
        deleteBook={deleteBook} 
        editBook={editBook} 
        />
        <AddBook
        newBook={newBook}
        handleInputChange={handleInputChange}
        addBookSubmit={async () => {
          const result = await addBook(newBook);
          resetForm();
          return result;
        }}
        />
      </main>
    </>
  )
}

export default Page