import mysql from "mysql";

// Database connection configuration
const DBConnection = mysql.createConnection({
  host: "localhost",
  user: "cs-25-sw-2-01@student.aau.dk", // Database username
  password: "mye7cahHm8/AWd%q",         // Database password
  database: "cs_25_sw_2_01",            // Database name
});

// Function to connect to the database and initialize tables
export function connectToDatabase() {
  DBConnection.connect((err) => {
    if (err) {
      console.error("❌ Database connection failed:", err);
      return;
    }
    console.log("✅ MySQL Connected!");

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
        console.error("❌ Error creating users table:", err);
      } else {
        console.log("✅ Users table is ready!");
      }
    });
  });
}

// Export the database connection object
export default DBConnection;
