/* ----- IMPORTS ----- */

// Core modules
import path from "path";
import { fileURLToPath } from "url";

// Third-party modules
import express from "express";
import { createServer } from "http";

// Custom modules
import router from "./router.js";
import { setupAuth } from "./setupAuth.js";
import { WebSocketServer } from "ws";
import { WebsocketListen } from "./serverWebsocket.js";
import DBConnection, {
  connectToDatabase,
  setupDatabaseRoutes,
} from "./databaseConnection.js";

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

/* ----- WEBSOCKETS ----- */
const wss = new WebSocketServer({ port: 4315 });

wss.on("connection", function connection(ws) {
  console.log("WebSocket connected");
  WebsocketListen(ws); // Handle WebSocket messages
});

/* ----- AUTHENTICATION ROUTES ----- */
setupAuth(app); // Set up login and signup routes

/* ----- DATABASE SETUP ----- */
connectToDatabase(); // Connect to the database and initialize tables
setupDatabaseRoutes(app); // Add database-related routes

/* ----- ROUTES ----- */

// Simple test route to verify server is running
app.get("/", (req, res) => {
  res.send("Server is running!");
});

/* ----- START SERVER ----- */

// Start the server on the specified port
let x = 1; // Change this value to switch between production and localhost
if (x === 1) {
  const PORT = 3315;
  server.listen(PORT, "0.0.0.0", () => {
    console.log(
      "🚀 Server is listening on https://cs-25-sw-2-01.p2datsw.cs.aau.dk/node5/"
    );
  });
} else if (x === 2) {
  const PORT = 3000;
  server.listen(PORT, "0.0.0.0", () => {
    console.log("🚀 Server is listening on http://localhost:3000");
  });
}
