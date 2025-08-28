import { useState, useEffect } from "react";

export interface Book {
  _id: string;
  title: string;
  author: string;
  publicationYear?: number;
  genre: string;
  description?: string;
  message?: string;
  tags?: string[];
  rating?: number;
  coverUrl?: string;
  isbn?: string;
}

export interface NewBook {
  title: string;
  author: string;
  publicationYear?: string | number;
  genre: string;
  description?: string;
  tags?: string[];
  rating?: number;
  coverUrl?: string;
  isbn?: string;
}

export interface SearchParams {
  title?: string;
  author?: string;
  tags?: string;
  genre?: string;
  publicationYear?: string | number;
  sort?: string;
  order?: 'asc' | 'desc';
  rating?: number;
}

export const useBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const fetchBooks = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to view books.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:5000/api/books",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          cache: 'no-store',
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to fetch books");
      setBooks(Array.isArray(data.results) ? data.results : []);

    } 
    catch (err: unknown) 
    {
      const errorMessage = err instanceof Error ? err.message : "Something went wrong";
      setError(errorMessage);
    } 
    finally {
      setLoading(false);
    }
  };

  const searchBooks = async (params: SearchParams) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to view books.");
      return;
    }

    try {
      const query = new URLSearchParams();
      if (params.title) query.set('title', params.title);
      if (params.author) query.set('author', params.author);
      if (params.tags) query.set('tags', params.tags);
      if (params.genre) query.set('genre', params.genre);
      if (params.publicationYear !== undefined && params.publicationYear !== null && params.publicationYear !== '') {
        query.set('publicationYear', String(params.publicationYear));
      }
      if (params.sort) query.set('sort', params.sort);
      if (params.order) query.set('order', params.order);
      if (params.rating !== undefined) query.set('rating', String(params.rating));

      const res = await fetch(
        `http://localhost:5000/api/books?${query.toString()}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          cache: 'no-store',
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to search books");
      
      setBooks(Array.isArray(data.results) ? data.results : []);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Something went wrong";
      setError(errorMessage);
    }
  };

  const addBook = async (newBook: NewBook): Promise<Book | null> => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in");
      return null;
    }

    try {
      const cleanedBook = { ...newBook };
      
      if (cleanedBook.isbn === '') delete cleanedBook.isbn;
      if (cleanedBook.coverUrl === '') delete cleanedBook.coverUrl;
      if (cleanedBook.description === '') delete cleanedBook.description;
      if (cleanedBook.publicationYear === '') delete cleanedBook.publicationYear;
      if (cleanedBook.tags && cleanedBook.tags.length === 0) delete cleanedBook.tags;
      if (cleanedBook.rating === undefined) delete cleanedBook.rating;

      const res = await fetch(
        "http://localhost:5000/api/books",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(cleanedBook),
        }
      );

      const createdBook: Book = await res.json();
      if (!res.ok) throw new Error(createdBook.message || "Failed to create book");

      setBooks((prev) => [...prev, createdBook]);
      return createdBook;

    } 
    catch (err: unknown) 
    {
      const errorMessage = err instanceof Error ? err.message : "Failed to create book";
      alert(errorMessage);
      return null;
    }
  };

  const deleteBook = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("You must be logged in");

    try {
      const res = await fetch(
        `http://localhost:5000/api/books/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to delete book");
      }

      setBooks((prev) => prev.filter((book) => book._id !== id));
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete book";
      alert(errorMessage);
    }
  };

  const editBook = async (id: string, updatedData: NewBook) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("You must be logged in");

    try {
  const cleanedData: Partial<NewBook> = { ...updatedData };
      if (cleanedData.isbn === '') delete cleanedData.isbn;
      if (cleanedData.coverUrl === '') delete cleanedData.coverUrl;
      if (cleanedData.description === '') delete cleanedData.description;
      if (cleanedData.publicationYear === '') delete cleanedData.publicationYear;
      if (Array.isArray(cleanedData.tags) && cleanedData.tags.length === 0) delete cleanedData.tags;
  if (cleanedData.rating === undefined) delete cleanedData.rating;

      const res = await fetch(
        `http://localhost:5000/api/books/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(cleanedData),
        }
      );

      const updatedBook: Book = await res.json();
      if (!res.ok) throw new Error(updatedBook.message || "Failed to update book");

      setBooks((prev) =>
        prev.map((book) => (book._id === id ? updatedBook : book))
      );
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update book";
      alert(errorMessage);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return { books, loading, error, fetchBooks, searchBooks, addBook, deleteBook, editBook };
};
