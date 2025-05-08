import mysql from "mysql";
import { authenticateJWT } from "../middleware/middleware_jwt.js";
import { testDbConfig } from "./testConfig.js"; // NEW

// Database connection configuration
export function createDbConnection(isTest = false) {  // NEW
  const config = isTest ? testDbConfig : {  // NEW
    host: "localhost",
    user: "cs-25-sw-2-01@student.aau.dk",
    password: "mye7cahHm8/AWd%q",
    database: "cs_25_sw_2_01",
  };  // NEW
  
  return mysql.createConnection(config);  // NEW
}  // NEW

let DBConnection = createDbConnection();  // NEW

// Function to connect to the database and initialize tables
export function connectToDatabase(isTest = false) {  // NEW
  return new Promise((resolve, reject) => {  // NEW
    if (isTest) {  // NEW
      DBConnection = createDbConnection(true);  // NEW
    }  // NEW
    
    DBConnection.connect((err) => {
      if (err) {
        console.error("Database connection failed:", err);
        reject(err);  // NEW
        return;
      }
      console.log("MySQL Connected!");

      createTables()  // NEW
        .then(() => resolve(DBConnection))  // NEW
        .catch(reject);  // NEW
    });
  });  // NEW
}

// NEW
export function createTables() {  // NEW
  return new Promise((resolve, reject) => {  // NEW
    const createUsersTable = `
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY, -- Unique user ID
                username VARCHAR(255) NOT NULL UNIQUE, -- Username (must be unique)
                password VARCHAR(255) NOT NULL -- Password
            )`;

    const createPasswordsTable = `
            CREATE TABLE IF NOT EXISTS passwords (
              id INT AUTO_INCREMENT PRIMARY KEY, -- Password ID
              password VARCHAR(255) NOT NULL, -- Password hash
              user_id INT NOT NULL, -- User ID
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Time of database entry
              FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE -- Ensures that user_id exists in users table and deletes all entries related to the user if the user is deleted
            )`;

    DBConnection.query(createUsersTable, (err, result) => {
      if (err) {
        console.error("Error creating users table:", err);
        reject(err);  // NEW
      } else {
        console.log("Users table is ready!");
        
        DBConnection.query(createPasswordsTable, (err, result) => {
          if (err) {
            console.error("Error creating results table:", err);
            reject(err);  // NEW
          } else {
            console.log("Results table is ready!");
            resolve();  // NEW
          }
        });
      }
    });
  });  // NEW
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

  // Route to fetch all users from the database
  app.get("/get-leaderboard", (req, res) => {
    const query = "SELECT * FROM users ORDER BY score DESC LIMIT 5"; // SQL query to fetch top 5 users
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
        res.json({ success: true, user: results });
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

  // API endopoint for updating the profile
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

  // GET endpoint for weak passwords on the server, for a given user id
  app.get("/passwordsDB", (req, res) => {
    try {
      // Get user id
      const user_id = req.query.user_id;

      // Create a querry to pull weaks passwords for a given user
      const query = "SELECT password FROM passwords WHERE user_id = ?";
      DBConnection.query(query, user_id, (err, results) => {
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
            message: `no passwords found for user with id ${user_id}`,
          });
        }

        console.log("Query results:", results); // Debug log
        res.json({
          success: true,
          passwords: results,
        });
      });
    } catch (error) {
      console.error("Password route error:", error);
      res.status(401).json({
        success: false,
        message: error.message,
      });
    }
  });
}

// Export the database connection object
export default DBConnection;
