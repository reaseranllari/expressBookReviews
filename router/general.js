const express = require('express');
const axios = require('axios'); 
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();


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


public_users.get('/', (req, res) => {
  return res.status(200).json(books);
});



public_users.get('/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  return res.status(200).json(books[isbn]);
});


public_users.get('/author/:author', (req, res) => {
  const author = req.params.author.toLowerCase();
  let result = {};

  for (let key in books) {
    if (books[key].author.toLowerCase() === author) {
      result[key] = books[key];
    }
  }

  return res.status(200).json(result);
});


public_users.get('/title/:title', (req, res) => {
  const title = req.params.title.toLowerCase();
  let result = {};

  for (let key in books) {
    if (books[key].title.toLowerCase() === title) {
      result[key] = books[key];
    }
  }

  return res.status(200).json(result);
});


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


public_users.get('/asyncisbn/:isbn', async (req, res) => {
  try {
    const response = await axios.get(`http://localhost:3000/isbn/${req.params.isbn}`);
    return res.status(200).json(response.data);
  } catch (err) {
    return res.status(500).json({ message: "Error fetching book" });
  }
});


public_users.get('/asyncauthor/:author', async (req, res) => {
  try {
    const response = await axios.get(`http://localhost:3000/author/${req.params.author}`);
    return res.status(200).json(response.data);
  } catch (err) {
    return res.status(500).json({ message: "Error fetching books" });
  }
});


public_users.get('/asynctitle/:title', async (req, res) => {
  try {
    const response = await axios.get(`http://localhost:3000/title/${req.params.title}`);
    return res.status(200).json(response.data);
  } catch (err) {
    return res.status(500).json({ message: "Error fetching books" });
  }
});


module.exports.general = public_users;