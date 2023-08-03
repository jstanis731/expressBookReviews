const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

//Function to check if the user exists
const doesExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

public_users.post("/register", (req,res) => {
  const username = req.query.username;
  const password = req.query.password;
  console.log (username, password);
  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

const getBooks = async (req, res) => {
  try {
    let booksString = JSON.stringify(books);;
    res.send({message: booksString});
  } catch (error) {
    console.error(error);
  }
};

const getBookByISBN = async (req, res) => {
  try {
    let isbn = req.params.isbn;
    let checkedBooks = [];
    for (let book in books) {
      checkedBooks.push(books[book].isbn);
      if (books[book].isbn == isbn) {
        let bookString = JSON.stringify(books[book]);
        res.send({message: bookString});
      }
    }
    res.send({message: "ISBN not found"});
  } catch (error) {
    console.error(error);
  }
};

const getBookByAuthor = async (req, res) => {
  try {
    let author = req.params.author;
    let results = [];
    for (let book in books) {
      if (books[book].author == author) {
        results.push(books[book]);
      }
    }
    if (results.length > 0) {
      let resultsString = JSON.stringify(results);
      res.send({message: resultsString});
    } else {
      res.send({message: "Author not found"});
    }
  } catch (error) {
    console.error(error);
  }
};

const getBookByTitle = async (req, res) => {
  try {
    let title = req.params.title;
    let results = [];
    for (let book in books) {
      if (books[book].title == title) {
        results.push(books[book]);
      }
    }
    if (results.length > 0) {
      let resultsString = JSON.stringify(results);
      res.send({message: resultsString});
    } else {
      res.send({message: "Title not found"});
    }
  } catch (error) {
    console.error(error);
  }
};

// Get the book list available in the shop
public_users.get('/', getBooks);

// Get book details based on ISBN
public_users.get('/isbn/:isbn', getBookByISBN);
  
// Get book details based on author
public_users.get('/author/:author', getBookByAuthor);

// Get all books based on title
public_users.get('/title/:title', getBookByTitle);

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  let results = [];
  for (let book in books) {
    if (book == isbn) {
      results.push(books[book].reviews);
    } 
  }
  if (results.length > 0) {
    res.send({message: JSON.stringify(results)});
  } else {
    res.send({message: "Review not found"});
  }
  
});

module.exports.general = public_users;
