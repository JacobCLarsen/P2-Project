import mysql from "mysql";

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

    // Create "profile" table if it does not already exist
    const createProfileTable = `
            CREATE TABLE IF NOT EXISTS profile (
                id INT AUTO_INCREMENT PRIMARY KEY, -- Unique profile ID
                name VARCHAR(255) NOT NULL,        -- Name of the user
                email VARCHAR(255) NOT NULL,       -- Email of the user
                bio TEXT                           -- Bio of the user
            )`;

    // Execute the query to create the profile table
    DBConnection.query(createProfileTable, (err, result) => {
      if (err) {
        console.error("Error creating profile table:", err); // Log error if table creation fails
      } else {
        console.log("Profile table is ready!"); // Log success message if table is created
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

  // Route to fetch all profiles from the database
  app.get("/profiles", (req, res) => {
    const query = "SELECT * FROM profile"; // SQL query to fetch all profiles
    // Execute the query to fetch all profiles
    DBConnection.query(query, (err, results) => {
      if (err) {
        // Log the error and respond with an error message if the query fails
        console.error("Error fetching profiles:", err);
        res
          .status(500)
          .json({ error: "Failed to fetch profiles from the database." });
      } else {
        // Respond with a success message and the list of profiles if the query succeeds
        console.log("Profiles fetched:", results); // Log the profiles to the console
        res.json({ success: true, profiles: results });
      }
    });
  });

  // Route to insert a new profile into the database
  app.post("/profiles", (req, res) => {
    const { name, email, bio } = req.body; // Extract name, email, and bio from the request body

    if (!name || !email || !bio) {
      return res
        .status(400)
        .json({ success: false, message: "Missing fields" });
    }

    const query = "INSERT INTO profile (name, email, bio) VALUES (?, ?, ?)";
    DBConnection.query(query, [name, email, bio], (err, result) => {
      if (err) {
        console.error("Error inserting profile:", err);
        res
          .status(500)
          .json({ success: false, message: "Failed to insert profile" });
      } else {
        console.log("Profile inserted:", {
          id: result.insertId,
          name,
          email,
          bio,
        });
        res.json({ success: true, message: "Profile inserted successfully" });
      }
    });
  });
}

// Export the database connection object
export default DBConnection;
