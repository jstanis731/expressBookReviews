const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.query.username;
  const password = req.query.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let isbn = req.params.isbn;
  let userReview = {'review': req.query.review, 'username': req.session.authorization.username};
  let username = req.session.authorization.username;
  let status = '';
  let checkedBooks = [];
  for (let book in books) {
    status = 'Book not found. '
    if (books[book].isbn == isbn) {
      status = 'Book found.';
      for (let review in books[book]) {
        console.log('book: ' + books[book].title + '\n' + 'reviews: ' + JSON.stringify(userReview));
        console.log('Review: ' + JSON.stringify(books[book].reviews));
        if (!books[book].reviews[review]) {
          books[book].reviews = userReview;
          return res.status(200).json({message: "Review successfully added:" + JSON.stringify(books[book].reviews + " This is the first review")});
        } else if (books[book].reviews[review].username == username) {
          books[book].reviews = userReview;
          return res.status(200).json({message: "Review successfully updated:" + JSON.stringify(book.reviews[review])});
        } else {
          books[book].reviews = userReview;
          return res.status(200).json({message: "Review successfully added:" + JSON.stringify(books[book].reviews)});
        }
      }
    }
  }
  status += "Review not added. "
  return res.status(404).json({message: status + "ISBN:" + isbn + " Username: " + username + " Review: " + userReview + "  Checked Books: " + checkedBooks});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;