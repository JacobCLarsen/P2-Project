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
  setupDatabaseRoutes,
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

// Connect to the database and initialize tables:
connectToDatabase();

// Set up database-related routes
setupDatabaseRoutes(app);

// Middleware to parse JSON payloads in incoming requests:
app.use(express.json());

// Simple test route to verify server is running:
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Test WebSocket proxy route (example usage):
app.use("/ws0", (req, res) =>
  proxy.web(req, res, { target: "ws://localhost:4310" })
);

// Start the server on the specified port:
const PORT = 3310;
server.listen(PORT, "0.0.0.0", () => {
  console.log(
    "🚀 Server is listening on https://cs-25-sw-2-01.p2datsw.cs.aau.dk/node0/"
  );
});
