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
        await addBook(newBook);
        resetForm();}}
        />
      </main>
    </>
  )
}

export default Page