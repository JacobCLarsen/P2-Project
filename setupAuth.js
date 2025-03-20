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
        res.json({ success: true, message: "Login successful!" }); // Respond with success if credentials are valid
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

  /* ----- Profile Management ----- */
  /**
   * Method: GET
   * URL: /profile/:userId
   * Description: Fetch the profile of a specific user by user ID.
   */
  app.get("/profile/:userId", (req, res) => {
    const { userId } = req.params;
    const query = "SELECT * FROM profiles WHERE user_id = ?";
    DBConnection.query(query, [userId], (err, results) => {
      if (err) {
        console.error("Error fetching profile:", err);
        return res
          .status(500)
          .json({ success: false, message: "Internal server error" });
      }
      if (results.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "Profile not found" });
      }
      res.json({ success: true, profile: results[0] });
    });
  });

  /**
   * Method: POST
   * URL: /profile
   * Description: Create or update a user's profile.
   */
  app.post("/profile", (req, res) => {
    const { userId, name, email, bio, profilePic } = req.body;

    // Check if the profile already exists
    const checkQuery = "SELECT * FROM profiles WHERE user_id = ?";
    DBConnection.query(checkQuery, [userId], (err, results) => {
      if (err) {
        console.error("Error checking profile:", err);
        return res
          .status(500)
          .json({ success: false, message: "Internal server error" });
      }

      if (results.length > 0) {
        // Update existing profile
        const updateQuery = `
          UPDATE profiles
          SET name = ?, email = ?, bio = ?, profile_pic = ?
          WHERE user_id = ?`;
        DBConnection.query(
          updateQuery,
          [name, email, bio, profilePic, userId],
          (err) => {
            if (err) {
              console.error("Error updating profile:", err);
              return res
                .status(500)
                .json({ success: false, message: "Internal server error" });
            }
            res.json({
              success: true,
              message: "Profile updated successfully!",
            });
          }
        );
      } else {
        // Insert new profile
        const insertQuery = `
          INSERT INTO profiles (user_id, name, email, bio, profile_pic)
          VALUES (?, ?, ?, ?, ?)`;
        DBConnection.query(
          insertQuery,
          [userId, name, email, bio, profilePic],
          (err) => {
            if (err) {
              console.error("Error creating profile:", err);
              return res
                .status(500)
                .json({ success: false, message: "Internal server error" });
            }
            res.json({
              success: true,
              message: "Profile created successfully!",
            });
          }
        );
      }
    });
  });

  // Log message to indicate that authentication routes have been set up
  console.log("Auth routes set up.");
}
