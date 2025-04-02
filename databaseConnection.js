import mysql from "mysql";
import { authenticateJWT } from "./middleware_jwt.js";

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

    // Create "users" table if it does not already exist
    const createUsersTable = `
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY, -- Unique user ID
                username VARCHAR(255) NOT NULL UNIQUE, -- Username (must be unique)
                password VARCHAR(255) NOT NULL -- Password
            )`;

    // Execute the query to create the table
    DBConnection.query(createUsersTable, (err, result) => {
      if (err) {
        console.error("Error creating users table:", err); // Log error if table creation fails
      } else {
        console.log("Users table is ready!"); // Log success message if table is created
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
}

const app = express();

// Database connection
const db = mysql.createPool({
  host: "your-db-host",
  user: "your-db-user",
  password: "your-db-password",
  database: "your-db-name",
});

// Profile route with token authentication
app.get("/profile", async (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Extract the token from the "Authorization" header

  try {
    // Validate the JWT token
    const user = await authenticateJWT(token);

    // The `user` variable will hold the decoded JWT data
    const userId = user.id;

    // Query the database to retrieve the user's profile data
    const [rows] = await db.query("SELECT username FROM users WHERE id = ?", [
      userId,
    ]);

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Send the profile data back to the client
    res.json({ success: true, user: rows[0] });
  } catch (error) {
    console.error("Error loading profile:", error);
    res.status(401).json({ success: false, message: error.message });
  }
});

// Export the database connection object
export default DBConnection;
