import mysql from "mysql";

// Create a connection to the database
const DBConnection = mysql.createConnection({
    host: "localhost",
    user: "cs-25-sw-2-01@student.aau.dk",
    password: "mye7cahHm8/AWd%q",
    database: "cs_25_sw_2_01"
});

// Connect to the database
DBConnection.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
        return;
    }
    console.log("✅ MySQL Connected Successfully!");
});

// Export the connection for use in other files
export default DBConnection;
