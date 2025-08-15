import { useState, useEffect } from "react";


export interface Book {
  _id: string;
  title: string;
  author?: string;
  publicationYear?: number;
  genre?: string;
  description?: string;
  message?: string;
}

export interface NewBook {
  title: string;
  author?: string;
  publicationYear?: string | number;
  genre?: string;
  description?: string;
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
        "https://back-end-api-34k5.onrender.com/api/books",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch books");
      setBooks(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const addBook = async (newBook: NewBook) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("You must be logged in");

    try {
      const res = await fetch(
        "https://back-end-api-34k5.onrender.com/api/books",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newBook),
        }
      );

      const createdBook: Book = await res.json();
      if (!res.ok) throw new Error(createdBook.message || "Failed to create book");

      setBooks((prev) => [...prev, createdBook]);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const deleteBook = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("You must be logged in");

    try {
      const res = await fetch(
        `https://back-end-api-34k5.onrender.com/api/books/${id}`,
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
    } catch (err: any) {
      alert(err.message);
    }
  };

  const editBook = async (id: string, updatedData: NewBook) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("You must be logged in");

    try {
      const res = await fetch(
        `https://back-end-api-34k5.onrender.com/api/books/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedData),
        }
      );

      const updatedBook: Book = await res.json();
      if (!res.ok) throw new Error(updatedBook.message || "Failed to update book");

      setBooks((prev) =>
        prev.map((book) => (book._id === id ? updatedBook : book))
      );
    } catch (err: any) {
      alert(err.message);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return { books, loading, error, fetchBooks, addBook, deleteBook, editBook };
};
