'use client';
import React, { useState } from 'react'
import "./page.css";
import { SearchParams, useBooks } from '../hooks/useBooks';
import { useForm } from '../hooks/useFormBooks';
import AddBook from './AddBook';
import SearchBar from './SearchBar';
import Filters from './Filters';
import SortToggle from './SortToggle';
import LayoutToggle from './LayoutToggle';
import BookList from './BookList';
import Link from 'next/link';


const Page = () => {
    const { books, loading, error, addBook, deleteBook, editBook, fetchBooks, searchBooks } = useBooks();
    const [layout, setLayout] = useState<'list' | 'grid'>('list');
    const [query, setQuery] = useState<SearchParams>({});
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
  if (error) return <p style={{ color: 'red' }}>{error}
    <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
      Login Up!
    </Link>
  </p>;


  return (
    <> 
      <main className="book-manager">
        <h1 className="book-manager__title">My Books</h1>
        <div className="book-manager__toolbar">
          <SearchBar onSearch={(q) => {
            setQuery((prev) => {
              const next: SearchParams = {
                ...prev,
                title: q.title?.trim() || undefined,
                author: q.author?.trim() || undefined,
                tags: q.tags?.trim() || undefined,
              };
              searchBooks(next);
              return next;
            });
          }} 
          />
          <Filters onChange={(f) => {
            setQuery((prev) => {
              const next: SearchParams = {
                ...prev,
                genre: f.genre || undefined,
                publicationYear: f.publicationYear || undefined,
              };
              searchBooks(next);
              return next;
            });
          }} 
          />
          <SortToggle onChange={(s) => {
            setQuery((prev) => {
              const next: SearchParams = {
                ...prev,
                sort: s.sort,
                order: s.order,
              };
              searchBooks(next);
              return next;
            });
          }} 
          />
          <LayoutToggle value={layout} onChange={setLayout} />
        </div>
        <BookList 
          books={books} 
          deleteBook={deleteBook} 
          editBook={editBook}
          fetchBooks={fetchBooks}
          layout={layout}
        />
        <AddBook
        newBook={newBook}
        handleInputChange={handleInputChange}
        addBookSubmit={async () => {
          const result = await addBook(newBook);
          resetForm();
          return result;
        }}
        onBookCreated={async () => {
          await fetchBooks();
        }}
        />
      </main>
    </>
  )
}

export default Page