import mysql from "mysql";

// Database connection configuration
const DBConnection = mysql.createConnection({
    host: "localhost",
    user: "cs-25-sw-2-01@student.aau.dk",
    password: "mye7cahHm8/AWd%q",
    database: "cs_25_sw_2_01"
});

// Function to connect to the database
export function connectToDatabase() {
    DBConnection.connect((err) => {
        if (err) {
            console.error("❌ Database connection failed:", err);
            return;
        }
        console.log("✅ MySQL Connected!");

        // Create users table if not exists
        const createUsersTable = `
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL
            )
        `;

        DBConnection.query(createUsersTable, (err, result) => {
            if (err) {
                console.error("❌ Error creating users table:", err);
            } else {
                console.log("✅ Users table is ready!");
            }
        });
    });
}

export default DBConnection;
