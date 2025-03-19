import mysql from "mysql";

// Database connection configuration
const DBConnection = mysql.createConnection({
  host: "localhost",
  user: "cs-25-sw-2-01@student.aau.dk", // Database username
  password: "mye7cahHm8/AWd%q", // Database password
  database: "cs_25_sw_2_01", // Database name
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

// Function to insert test data into the users table
export function insertTestData() {
  const testUsers = [
    { username: "Philip", password: "1110" },
    { username: "Jacob", password: "345" },
    { username: "Daniel", password: "123" },
    { username: "Anders", password: "1234" },
    { username: "Zet", password: "1234" },
    { username: "Viktor", password: "123" },
  ];

  testUsers.forEach((user) => {
    const query = "INSERT INTO users (username, password) VALUES (?, ?)";
    DBConnection.query(query, [user.username, user.password], (err, result) => {
      if (err) {
        console.error(`❌ Error inserting user ${user.username}:`, err);
      } else {
        console.log(`✅ User ${user.username} inserted!`);
      }
    });
  });
}

// Export the database connection object
export default DBConnection;
