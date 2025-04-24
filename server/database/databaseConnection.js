import mysql from "mysql";
import { authenticateJWT } from "../middleware/middleware_jwt.js"; // Corrected path

// Database connection configuration
const DBConnection = mysql.createConnection({
  host: "localhost", // Database host
  user: "cs-25-sw-2-01@student.aau.dk", // Database username
  password: "mye7cahHm8/AWd%q", // Database password
  database: "cs_25_sw_2_01", // Database name
});

// Function to connect to the database and initialize tables
export function connectToDatabase() {
  DBConnection.connect((err) => {
    if (err) {
      console.error("Database connection failed:", err); // Log error if connection fails
      return;
    }
    console.log("MySQL Connected!"); // Log success message if connection is successful

    // Create "users" table
    const createUsersTable = `
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY, -- Unique user ID
                username VARCHAR(255) NOT NULL UNIQUE, -- Username (must be unique)
                password VARCHAR(255) NOT NULL -- Password
            )`;

    // Create "results" table
    const createPasswordsTable = `
            CREATE TABLE passwords (
              id INT AUTO_INCREMENT PRIMARY KEY, -- Password ID
              password VARCHAR(255) NOT NULL, -- Password hash
              user_id INT NOT NULL, -- User ID
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Time of database entry
              FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE -- Ensures that user_id exists in users table and deletes all entries related to the user if the user is deleted
            )`;

    // Execute the query to create the "users" table
    DBConnection.query(createUsersTable, (err, result) => {
      if (err) {
        console.error("Error creating users table:", err); // Log error if table creation fails
      } else {
        console.log("Users table is ready!"); // Log success message if table is created
      }
    });

    // Execute the query to create the "results" table
    DBConnection.query(createPasswordsTable, (err, result) => {
      if (err) {
        console.error("Error creating results table:", err); // Log error if table creation fails
      } else {
        console.log("Results table is ready!"); // Log success message if table is created
      }
    });
  });
}

// Function to set up database-related routes
export function setupDatabaseRoutes(app) {
  // Route to test database connection
  app.get("/test-db", (req, res) => {
    // Execute a simple query to test the database connection
    DBConnection.query("SELECT 1 + 1 AS result", (err, result) => {
      if (err) {
        // Respond with an error message if the query fails
        res.status(500).json({ error: "Database connection failed!" });
      } else {
        // Respond with a success message and query result if the query succeeds
        res.json({ success: true, message: "Database connected!", result });
      }
    });
  });

  // Route to fetch all users from the database
  app.get("/users", (req, res) => {
    const query = "SELECT * FROM users"; // SQL query to fetch all users
    // Execute the query to fetch all users
    DBConnection.query(query, (err, results) => {
      if (err) {
        // Log the error and respond with an error message if the query fails
        console.error("Error fetching users:", err);
        res
          .status(500)
          .json({ error: "Failed to fetch users from the database." });
      } else {
        // Respond with a success message and the list of users if the query succeeds
        res.json({ success: true, users: results });
      }
    });
  });

  // Profile route with token authentication
  app.get("/profile-data", async (req, res) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      console.log("Token received:", token); // Debug log

      if (!token) {
        return res.status(401).json({
          success: false,
          message: "No token provided",
        });
      }

      const decoded = await authenticateJWT(token);
      console.log("Decoded token:", decoded); // Debug log

      // Use a Promise-based query instead of callback
      const query =
        "SELECT username, tasks, email, bio FROM users WHERE id = ?";
      DBConnection.query(query, [decoded.userId], (err, results) => {
        if (err) {
          console.error("Database query error:", err);
          return res.status(500).json({
            success: false,
            message: "Database query failed",
          });
        }

        if (results.length === 0) {
          return res.status(404).json({
            success: false,
            message: "User not found",
          });
        }

        console.log("Query results:", results); // Debug log
        res.json({
          success: true,
          user: results[0],
        });
      });
    } catch (error) {
      console.error("Profile route error:", error);
      res.status(401).json({
        success: false,
        message: error.message,
      });
    }
  });
  app.put("/profile-update", async (req, res) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
        return res
          .status(401)
          .json({ success: false, message: "No token provided" });
      }

      const decoded = await authenticateJWT(token);
      const userId = decoded.userId;

      const { username, email, bio } = req.body;

      // Validate input
      if (!username || !email || !bio) {
        return res
          .status(400)
          .json({ success: false, message: "All fields are required" });
      }

      // Update user data in the database
      const query =
        "UPDATE users SET username = ?, email = ?, bio = ? WHERE id = ?";
      DBConnection.query(
        query,
        [username, email, bio, userId],
        (err, result) => {
          if (err) {
            console.error("Database update error:", err);
            return res
              .status(500)
              .json({ success: false, message: "Database update failed" });
          }

          if (result.affectedRows === 0) {
            return res
              .status(404)
              .json({ success: false, message: "User not found" });
          }

          res.json({ success: true, message: "Profile updated successfully" });
        }
      );
    } catch (error) {
      console.error("Profile update error:", error);
      res.status(401).json({ success: false, message: error.message });
    }
  });
}

// Export the database connection object
export default DBConnection;
