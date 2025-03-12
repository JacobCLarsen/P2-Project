const express = require("express");
const router = express.Router();

// Define a route for the home page
router.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/html/workerpage.html");
});

// Route for the login page
router.get("/login", (req, res) => {
  res.sendFile(__dirname + "/public/html/login.html");
});

// Route for the about page
router.get("/about", (req, res) => {
  res.sendFile(__dirname + "/public/html/about.html");
});

module.exports = router;
