const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }

};


const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
let validusers = users.filter((user) => {
    return (user.username === username && user.password === password);
  });
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }

};

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
    const password = req.body.password;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const review = req.query.review;
 
  // Extract username from session (saved during login)
  const username = req.session.authorization['username'];

  if (!review) {
    return res.status(400).json({ message: "Review content is required in query parameters (?review=...)" });
  }

  if (books[isbn]) {
    let book = books[isbn];
 
    // If reviews object doesn't exist for the book, create it
    if (!book.reviews) {
      book.reviews = {};
    }
 
    // Add or overwrite the review for this specific user
    book.reviews[username] = review;
 
    return res.status(200).json({
      message: `The review for the book with ISBN ${isbn} has been added/updated.`,
      reviews: book.reviews
    });
  } else {
    return res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });
  }

});
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization['username'];
  
    if (books[isbn]) {
      let book = books[isbn];
   
      // Check if the user has a review for this book
      if (book.reviews && book.reviews[username]) {
        delete book.reviews[username];
        return res.status(200).json({
          message: `Reviews for ISBN ${isbn} posted by user ${username} deleted.`,
          reviews: book.reviews
        });
      } else {
        return res.status(404).json({ message: `No review found for user ${username} under ISBN ${isbn}.` });
      }
    } else {
      return res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });
    }
  });
  

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
