/* Imports: */
// - Import the Express framework for creating a web server
// - Import the database connection
import express from "express";
import DBConnection from "../database/databaseConnection.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

/**
 * Function to set up authentication-related routes in the Express app.
 * @param {object} app - The Express application instance
 */
export function setupAuth(app) {
  // Middleware to parse JSON data from incoming requests
  app.use(express.json()); // Enables parsing of JSON payloads in incoming requests

  /* ----- Login (Handles User Authentication) ----- */
  /**
   * Method: POST
   * URL: /login
   * Request Body: { username: "example", password: "password123" }
   * Response: { success: true/false, message: "Login successful!" / "Invalid username or password" }
   */
  app.post("/login", async (req, res) => {
    const { username, password } = req.body; // Extract username and password from the request body

    if (!username || !password) {
      return res
        .status(400) // Respond with "Bad Request" if username or password is missing
        .json({ success: false, message: "Missing username or password" });
    }

    // Query the database to check if the username and password match
    const query = "SELECT * FROM users WHERE username = ? AND password = ?";
    DBConnection.query(query, [username, password], (err, results) => {
      if (err) {
        console.error("Error validating login:", err); // Log error if query fails
        return res
          .status(500)
          .json({ success: false, message: "Internal server error" }); // Respond with "Internal Server Error"
      }

      if (results.length > 0) {
        const token = jwt.sign(
          { userId: results[0].id },
          process.env.JWT_SECRET,
          {
            expiresIn: process.env.JWT_EXPIRES_IN,
          }
        );
        res.json({ success: true, message: "Login successful!", token: token });
      } else {
        res
          .status(401) // Respond with "Unauthorized" if credentials are invalid
          .json({ success: false, message: "Invalid username or password" });
      }
    });
  });

  /* ----- Signup: (Handles New User Registration) ----- */
  /**
   * Method: POST
   * URL: /signup
   * Request Body: { username: "newUser", password: "securePassword" }
   * Response: { success: true/false, message: "User registered successfully" / "Username already exists" }
   */
  app.post("/signup", async (req, res) => {
    const { username, password } = req.body; // Extract username and password from the request body

    if (!username || !password) {
      return res
        .status(400) // Respond with "Bad Request" if username or password is missing
        .json({ success: false, message: "Missing username or password" });
    }

    // Check if the username already exists
    const checkQuery = "SELECT * FROM users WHERE username = ?";
    DBConnection.query(checkQuery, [username], (err, results) => {
      if (err) {
        console.error("Error checking username:", err); // Log error if query fails
        return res
          .status(500)
          .json({ success: false, message: "Internal server error" }); // Respond with "Internal Server Error"
      }

      if (results.length > 0) {
        return res
          .status(400) // Respond with "Bad Request" if username is already taken
          .json({ success: false, message: "Username already taken!" });
      }

      // Insert the new user into the database
      const insertQuery =
        "INSERT INTO users (username, password) VALUES (?, ?)";
      DBConnection.query(insertQuery, [username, password], (err, result) => {
        if (err) {
          console.error("❌ Error creating user:", err); // Log error if query fails
          return res
            .status(500)
            .json({ success: false, message: "Internal server error" }); // Respond with "Internal Server Error"
        }

        res.json({ success: true, message: "Account created successfully!" }); // Respond with success if user is created
      });
    });
  });

  // Log message to indicate that authentication routes have been set up
  console.log("Auth routes set up.");
}
