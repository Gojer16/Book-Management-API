import React from 'react';
import Books from './Books';
import { Book, NewBook } from '../hooks/useBooks';

interface BookListProps {
  books: Book[];
  layout: 'list' | 'grid';
  deleteBook: (id: string) => Promise<void>;
  editBook: (id: string, updatedBook: NewBook) => Promise<void>;
  fetchBooks: () => Promise<void>;
}

const BookList: React.FC<BookListProps> = ({ books, layout, deleteBook, editBook, fetchBooks }) => {
  return (
    <Books
      books={books}
      deleteBook={deleteBook}
      editBook={editBook}
      fetchBooks={fetchBooks}
      layout={layout}
    />
  );
};

export default BookList;
