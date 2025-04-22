const fsPromises = require('fs').promises;
const path = require('path');
const booksFilePath = path.join(__dirname, '../model/books.json');

let initialBooks = [];
try {
  initialBooks = require('../model/books.json');
} catch (err) {
  console.error('Error reading books.json', err);
}

const data = {
  books: initialBooks,
  setBooks: async function (newData) {
    this.books = newData;
    try {
      await fsPromises.writeFile(
        booksFilePath,
        JSON.stringify(this.books, null, 2),
        'utf-8'
      );
      return true;
    } catch (err) {
      console.error('Error writing to books.json:', err);
      return false;
    }
  },
};

const findBookById = (bookId) =>
  data.books.find(({ id }) => id === parseInt(bookId));

const findBooksByQuery = (query) => {
  if (!query || Object.keys(query).length === 0) return data.books;

  return data.books.filter((book) => {
    let matchesAll = true;
    for (const key of Object.keys(query)) {
      const value = query[key];
      if (
        book[key] &&
        String(book[key]).toLowerCase().includes(value.toLowerCase())
      ) {
        continue;
      } else {
        matchesAll = false;
        break;
      }
    }
    return matchesAll;
  });
};

const getAllBooks = (req, res) => {
  const filteredBooks = findBooksByQuery(req.query);
  res.json(filteredBooks);
};

const createNewBook = async (req, res) => {
  const newBook = {
    id: (data.books[data.books.length - 1]?.id ?? 0) + 1 || 1,
    title: req.body.title,
    author: req.body.author ?? 'Unknown',
    year: req.body.year ?? null,
  };

  if (!newBook.title) {
    return res.status(400).json({ message: 'Title is required!' });
  }

  const isNewBook = await data.setBooks([...data.books, newBook]);
  if (isNewBook) res.status(201).json(data.books);
  else res.status(500).json({ message: 'Failed to create new book' });
};

const updateBook = async (req, res) => {
  const updateBook = findBookById(req.body.id);
  if (!updateBook) {
    return res
      .status(400)
      .json({ message: `Book ID ${req.body.id} not found` });
  }

  if (req.body.title) updateBook.title = req.body.title;
  if (req.body.author) updateBook.author = req.body.author;
  if (req.body.year) updateBook.year = req.body.year;

  const isBookUpdated = await data.setBooks(
    data.books.map((book) => (book.id === updateBook.id ? updateBook : book))
  );

  if (isBookUpdated) res.json(data.books);
  else res.status(500).json({ message: 'Failed to update book' });
};

const deleteBook = async (req, res) => {
  const deleteBook = findBookById(req.params?.id);

  if (!deleteBook) {
    return res
      .status(404)
      .json({ message: `Book ID ${req.params?.id} not found` });
  }

  const isBookDeleted = await data.setBooks(
    data.books.filter((book) => book.id !== deleteBook.id)
  );

  if (isBookDeleted) res.json(data.books);
  else res.status(500).json({ message: 'Failed to delete book' });
};

const getBook = (req, res) => {
  const book = findBookById(req.params.id);

  if (!book) {
    return res
      .status(404)
      .json({ message: `Book ID ${req.params.id} not found` });
  }
  res.json(book);
};

module.exports = {
  getAllBooks,
  createNewBook,
  updateBook,
  deleteBook,
  getBook,
};
