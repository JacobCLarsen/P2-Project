/* Imports:
 * Express for API's/ routing
 * Socket.io (Websockets) are used for real-time communication between the clients and the server
 * Router for handling webpage routes
 * Database connection and setup utilities
 */
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import router from "./router.js";
import { setupSocketCommunication } from "./setupSocketCommunication.js";
import { setupAuth } from "./setupAuth.js";
import path from "path";
import { fileURLToPath } from "url";
import DBConnection, {
  connectToDatabase,
  insertTestData,
} from "./databaseConnection.js"; // Import DB connection function and insertTestData

// Define the path of the current file and directory:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express App & HTTP Server:
const app = express();
const server = createServer(app);

// Create socket.io Server for WebSocket communication:
const io = new Server(server);

// Use the router for handling routes:
app.use("/", router);

// Serve static files from the "public" directory:
app.use(express.static(path.join(__dirname, "public")));

// Set up WebSocket communication:
setupSocketCommunication(io);

// Set up authentication routes (e.g., login/signup):
setupAuth(app);

// Middleware to parse JSON payloads in incoming requests:
app.use(express.json());

// Test WebSocket proxy route (example usage):
app.use("/ws0", (req, res) =>
  proxy.web(req, res, { target: "ws://localhost:4310" })
);

// Connect to the database and initialize tables:
connectToDatabase();

// Simple test route to verify server is running:
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Route to test database connection:
app.get("/test-db", (req, res) => {
  DBConnection.query("SELECT 1 + 1 AS result", (err, result) => {
    if (err) {
      res.status(500).json({ error: "Database connection failed!" });
    } else {
      res.json({ success: true, message: "Database connected!", result });
    }
  });
});

// Route to fetch all users from the database
app.get("/users", (req, res) => {
  const query = "SELECT * FROM users"; // SQL query to fetch all users
  DBConnection.query(query, (err, results) => {
    if (err) {
      console.error("❌ Error fetching users:", err);
      res
        .status(500)
        .json({ error: "Failed to fetch users from the database." });
    } else {
      res.json({ success: true, users: results });
    }
  });
});

// Start the server on the specified port:
const PORT = 3310;
server.listen(PORT, "0.0.0.0", () => {
  console.log(
    "🚀 Server is listening on https://cs-25-sw-2-01.p2datsw.cs.aau.dk/node0/"
  );
});
