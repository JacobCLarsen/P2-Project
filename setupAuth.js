/* Imports: */
// - Import the Express framework for creating a web server
// - Import the database connection
import express from "express";
import DBConnection from "./databaseConnection.js";

/**
 * Function to set up authentication-related routes in the Express app.
 * @param {object} app - The Express application instance
 */
export function setupAuth(app) {
  //Middleware to parse JSON data from incoming requests
  app.use(express.json()); //Enable JSON body parsing

  /* Login: (Handles user authentication) */
  /**
   * Method: POST
   * URL: /login
   * Request Body: { username: "example", password: "password123" }
   * Response: { success: true/false, message: "Login successful!" / "Invalid username or password" }
   */
  app.post("/login", async (req, res) => {
    //Extract username and password from the request body
    const { username, password } = req.body;

    //Check if both username and password are provided
    if (!username || !password) {
      return res
        .status(400) //Bad request status response code
        .json({ success: false, message: "Missing username or password" }); //Error message if username or password is missing
    }

    // Query the database to check if the username and password match
    const query = "SELECT * FROM users WHERE username = ? AND password = ?";
    DBConnection.query(query, [username, password], (err, results) => {
      if (err) {
        console.error("❌ Error validating login:", err);
        return res
          .status(500)
          .json({ success: false, message: "Internal server error" });
      }

      if (results.length > 0) {
        res.json({ success: true, message: "Login successful!" });
      } else {
        res
          .status(401)
          .json({ success: false, message: "Invalid username or password" });
      }
    });
  });

  /* Signup: (Handles new user registration) */
  /**
   * Method: POST
   * URL: /signup
   * Request Body: { username: "newUser", password: "securePassword" }
   * Response: { success: true/false, message: "User registered successfully" / "Username already exists" }
   */
  app.post("/signup", async (req, res) => {
    //Extract username and password from the request body
    const { username, password } = req.body;

    //Check if both username and password are provided
    if (!username || !password) {
      return res
        .status(400) //Bad request status response code
        .json({ success: false, message: "Missing username or password" }); //Error message if username or password is missing
    }

    // Check if the username already exists
    const checkQuery = "SELECT * FROM users WHERE username = ?";
    DBConnection.query(checkQuery, [username], (err, results) => {
      if (err) {
        console.error("❌ Error checking username:", err);
        return res
          .status(500)
          .json({ success: false, message: "Internal server error" });
      }

      if (results.length > 0) {
        return res
          .status(400)
          .json({ success: false, message: "Username already taken!" });
      }

      // Insert the new user into the database
      const insertQuery =
        "INSERT INTO users (username, password) VALUES (?, ?)";
      DBConnection.query(insertQuery, [username, password], (err, result) => {
        if (err) {
          console.error("❌ Error creating user:", err);
          return res
            .status(500)
            .json({ success: false, message: "Internal server error" });
        }

        res.json({ success: true, message: "Account created successfully!" });
      });
    });
  });

  //Log message to indicate that authentication routes have been set up
  console.log("Auth routes set up.");
}
