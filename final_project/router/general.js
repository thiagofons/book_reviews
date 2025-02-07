const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "You must provide both an username and a password" });
  }
  if (users[username]) {
    return res.status(200).json({ message: "User already registered" });
  } else {
    users.push({
      username,
      password,
    });
    return res.status(200).json({
      data: { username, password },
      message: "Success on registering user",
    });
  }
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  return getBookListAsync(req, res);

  if (books) {
    return res.status(200).json({ data: JSON.stringify(books, null, 4) });
  }
  return res.status(400).json({ message: "No books in the database" });
});

const getBookListAsync = async (req, res) => {
  const fetchBooks = new Promise((resolve, reject) => {
    if (books) {
      resolve(books);
    } else {
      reject([]);
    }
  });

  fetchBooks
    .then((data) => res.status(200).json({ data: data }))
    .catch((error) => res.status(400).json({ data: [], message: error }));
};

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  return getBookByIsbnAsync(req, res);

  const { isbn } = req.params;

  if (isbn) {
    const book = books[isbn];

    if (book) {
      return res.status(200).json({ data: book });
    }
    return res
      .status(400)
      .json({ message: `There's no book with ISBN ${isbn}` });
  }
  return res.status(400).json({ message: "Please, provide a valid ISBN" });
});

const getBookByIsbnAsync = async (req, res) => {
  const { isbn } = req.params;

  if (isbn) {
    const fetchBooks = new Promise((resolve, reject) => {
      if (books[isbn]) {
        resolve(books[isbn]);
      } else {
        reject([]);
      }
    });

    fetchBooks
      .then((data) => res.status(200).json({ data: data }))
      .catch((error) => res.status(400).json({ data: [], message: error }));
  }
};

// Get book details based on author
public_users.get("/author/:author", function (req, res) {

  return getBookDetailsByAuthorAsync(req, res);

  const { author } = req.params;

  if (author) {
    const authorBooks = [];

    for (let book in books) {
      if (books[book].author.includes(author)) {
        authorBooks.push(books[book]);
      }
    }
    if (authorBooks.length > 0) {
      return res.status(200).json({ data: authorBooks });
    }
    return res.status(400).json({
      data: authorBooks,
      message: "Author does not exist in the database",
    });
  }
  return res
    .status(400)
    .json({ message: "You must provide a valid author name" });
});

const getBookDetailsByAuthorAsync = async (req, res) => {
  const { author } = req.params;

  if (author) {
    const fetchBook = new Promise((resolve, reject) => {
      const authorBooks = [];

      for (let book in books) {
        if (books[book].author.includes(author)) {
          authorBooks.push(books[book]);
        }
      }
      if (authorBooks.length > 0) {
        resolve(res.status(200).json({ data: authorBooks }));
      }
      reject(
        res.status(400).json({
          data: authorBooks,
          message: "Author does not exist in the database",
        })
      );
    });

    fetchBook
      .then((data) => res.status(200).json({ data: data }))
      .catch((error) => res.status(400).json({ data: [], message: error }));
  }
};

// Get all books based on title
public_users.get("/title/:title", function (req, res) {

  return getBookDetailsByTitleAsync(req, res);

  const { title } = req.params;

  if (title) {
    const titleBooks = [];

    for (let book in books) {
      if (books[book].title.includes(title)) {
        titleBooks.push(books[book]);
      }
    }
    if (titleBooks.length > 0) {
      return res.status(200).json({ data: titleBooks });
    }
    return res.status(400).json({
      data: titleBooks,
      message: "There's no book with this title",
    });
  }
  return res
    .status(400)
    .json({ message: "You must provide a valid book title" });
});

const getBookDetailsByTitleAsync = async (req, res) => {
  const { title } = req.params;

  if (title) {
    const fetchBook = new Promise((resolve, reject) => {
      const titleBooks = [];

      for (let book in books) {
        if (books[book].title.includes(title)) {
          titleBooks.push(books[book]);
        }
      }
      if (titleBooks.length > 0) {
        resolve(res.status(200).json({ data: titleBooks }));
      }
      reject(
        res.status(400).json({
          data: titleBooks,
          message: "There's no book with this title",
        })
      );
    });

    fetchBook
      .then((data) => res.status(200).json({ data: data }))
      .catch((error) => res.status(400).json({ data: [], message: error }));
  }
};

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const { isbn } = req.params;

  if (isbn) {
    const reviews = books[isbn].reviews;

    if (reviews) {
      return res.status(200).json({ data: reviews });
    }
    return res.status(400).json({
      data: reviews,
      message: `There's no reviws in book with ISBN ${isbn}`,
    });
  }
  return res.status(400).json({ message: "Please, provide a valid ISBN" });
});

module.exports.general = public_users;
