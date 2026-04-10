const express = require('express');
const axios = require('axios'); 
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();


// Register new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  if (isValid(username)) {
    return res.status(409).json({ message: "User already exists" });
  }

  users.push({ username, password });

  return res.status(200).json({
    message: "User successfully registered. Now you can login"
  });
});


//  Get ALL books (ASYNC)
public_users.get('/', async (req, res) => {
  try {
    return res.status(200).json(books);
  } catch (err) {
    return res.status(500).json({ message: "Error fetching books" });
  }
});


//  Get book by ISBN (PROMISE)
public_users.get('/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;

  return new Promise((resolve, reject) => {
    if (!books[isbn]) reject("Not found");
    else resolve(books[isbn]);
  })
  .then(book => res.status(200).json(book))
  .catch(() => res.status(404).json({ message: "Book not found" }));
});


//  Get books by AUTHOR (ASYNC)
public_users.get('/author/:author', async (req, res) => {
  const author = req.params.author.toLowerCase();

  let result = {};
  for (let key in books) {
    if (books[key].author.toLowerCase() === author) {
      result[key] = books[key];
    }
  }

  return res.status(200).json(result);
});


//  Get books by TITLE (ASYNC)
public_users.get('/title/:title', async (req, res) => {
  const title = req.params.title.toLowerCase();

  let result = {};
  for (let key in books) {
    if (books[key].title.toLowerCase() === title) {
      result[key] = books[key];
    }
  }

  return res.status(200).json(result);
});


// Get book reviews
public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  return res.status(200).json(books[isbn].reviews);
});



public_users.get('/asyncbooks', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:3000/');
    return res.status(200).json(response.data);
  } catch (err) {
    return res.status(500).json({ message: "Error fetching books" });
  }
});

module.exports.general = public_users;