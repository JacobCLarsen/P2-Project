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
import DBConnection, { connectToDatabase } from "./databaseConnection.js"; // Import DB connection function

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

// Simple test route
app.get("/", (req, res) => {
    res.send("Server is running!");
});

// Check database connection (remains in server.js but uses imported connection)
app.get("/test-db", (req, res) => {
    DBConnection.query("SELECT 1 + 1 AS result", (err, result) => {
        if (err) {
            res.status(500).json({ error: "Database connection failed!" });
        } else {
            res.json({ success: true, message: "Database connected!", result });
        }
    });
});

// Port for the Server:
const PORT = 3310;
server.listen(PORT, "0.0.0.0", () => {
    console.log("🚀 Server is listening on http://localhost:3310");
});






/* Imports:
 * Express for API's/ routing
 * Socket.io (Websockets) are used for real time communication between the clients and the server
 * "require "./router"" specifies wherer to find the routes for the webpages
 */
/*
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import router from "./router.js";
import { setupSocketCommunication } from "./setupSocketCommunication.js";
import { setupAuth } from "./setupAuth.js";
import path from "path";
import { fileURLToPath } from "url";
import DBConnection from "./database.js"; // Import database connection

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express App & Server:
const app = express();
const server = createServer(app);

// Create socket.io Server:
const io = new Server(server);

// Use the router for handling routes:
app.use("/", router);

// Define the path of public content:
app.use(express.static(path.join(__dirname, "public")));

// Set up Socket Communication:
setupSocketCommunication(io);

// Database Connection:
databaseConnection();


// Test
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

// Start the server on the specified port:
const PORT = 3310;
server.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 Server is listening on http://localhost:3310");
});
