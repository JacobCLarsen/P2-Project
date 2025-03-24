/* ----- IMPORTS ----- */
// TODO; We should use node Fetch

// Core modules
import path from "path";
import { fileURLToPath } from "url";

// Third-party modules
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

// Custom modules
import router from "./router.js";
import { setupAuth } from "./setupAuth.js";

import { WebSocketServer } from "ws";
import { WebsocketListen } from "./serverWebsocket.js";

import jwt from "jsonwebtoken";

import DBConnection, {
  connectToDatabase,
  setupDatabaseRoutes,
} from "./databaseConnection.js";

export const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(403)
      .json({ message: "Unauthorized. No token provided." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid or expired token." });
    }

    req.user = decoded; // Attach user data to request object
    next(); // Proceed to the next middleware or route handler
  });
};

// Define the path of the current file and directory:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express App & HTTP Server:
const app = express();
const server = createServer(app);

/* ----- MIDDLEWARE ----- */

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Middleware to parse JSON payloads in incoming requests
app.use(express.json());

// Use the router for handling routes
app.use("/", router);

// Websockets:

const wss = new WebSocketServer({ port: 4311 });

wss.on("connection", function connection(ws) {
  console.log("connected");
  // Pass the WebSocket server instance to WebsocketListen
  WebsocketListen(ws, wss);
});
// Set up authentication routes (e.g., login/signup):
setupAuth(app);

/* ----- DATABASE SETUP ----- */

// Connect to the database and initialize tables
connectToDatabase(); // Establishes a connection to the MySQL database and ensures the "users" table exists

// Set up database-related routes
setupDatabaseRoutes(app); // Adds routes for testing the database connection and fetching users

// Simple test route to verify server is running
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Start The Server on the Specified Port (x = 1 (SERVER RAN) or x = 2 (LOCALHOST)):
let x = 1;
if (x === 1) {
  const PORT = 3319;
  server.listen(PORT, "0.0.0.0", () => {
    console.log(
      "🚀 Server is listening on https://cs-25-sw-2-01.p2datsw.cs.aau.dk/node9/"
    );
  });
} else if (x === 2) {
  const PORT = 3000;
  server.listen(PORT, "0.0.0.0", () => {
    console.log("🚀 Server is listening on http://localhost:3000");
  });
}
