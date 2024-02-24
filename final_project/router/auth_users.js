const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
};

const authenticatedUser = (username, password) => {
  console.log(username, password);
  console.log(users);
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
};

regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60 * 60 }
    );
    req.session.authorization = {
      accessToken,
      username,
    };
    return res
      .status(200)
      .json({ token: accessToken, message: "User successfully logged in" });
  } else {
    return res
      .status(208)
      .json({ message: "Invalid Login: Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { username, review } = req.body;

  if (!review || !username) {
    return res.status(208).json({ message: "Invalid Review: Check content" });
  }
  if (!books[isbn]) {
    return res.status(208).json({ message: "Invalid ISBN, try again" });
  } else {
    books[isbn].reviews[username] = review;

    return res.status(200).json({ data: review });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { username } = req.body;

  if (!review || !username) {
    return res.status(208).json({ message: "Invalid Review: Check content" });
  }
  if (!books[isbn]) {
    return res.status(208).json({ message: "Invalid ISBN, try again" });
  } else {
    delete books[isbn].reviews[username];

    return res.status(200).json({ data: books[isbn].reviews });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
module.exports.authenticatedUser = authenticatedUser;
