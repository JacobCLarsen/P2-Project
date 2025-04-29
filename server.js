/* ----- IMPORTS ----- */
// TODO; We should use node Fetch

// Core Modules
import path from "path";
import { fileURLToPath } from "url";

// Third-Party Modules
import express from "express";
import { createServer } from "http";

// Custom Modules
import router from "./server/routes/router.js"; // Updated path
import { setupAuth } from "./server/routes/setupAuth.js"; // Updated path

import { WebSocketServer } from "ws";
import { WebsocketListen } from "./server/websocket/serverWebsocket.js"; // Updated path

import DBConnection, {
  connectToDatabase,
  setupDatabaseRoutes,
} from "./server/database/databaseConnection.js"; // Updated path
import { storeResults } from "./server/database/storeResults.js"; // Updated path

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
app.use(express.json({ limit: "10mb" })); // Allows 10MB payloads
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Use the router for handling routes
app.use("/", router);

// Websockets:

const wss = new WebSocketServer({ port: 4313 });

wss.on("connection", function connection(ws) {
  console.log("connected");

  WebsocketListen(ws, wss);
});

// Set up authentication routes (e.g., login/signup):
setupAuth(app);

/* ----- DATABASE SETUP ----- */

// Connect to the database and initialize tables
connectToDatabase(); // Establishes a connection to the MySQL database and ensures the "users" table exists

// Set up database-related routes
setupDatabaseRoutes(app); // Adds routes for testing the database connection and fetching users
storeResults(app);

// Simple test route to verify server is running
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Start The Server on the Specified Port (x = 1 (SERVER RAN) or x = 2 (LOCALHOST)):
let x = 1;
if (x === 1) {
  const PORT = 3313;

  server.listen(PORT, "0.0.0.0", () => {
    console.log(
      "🚀 Server is listening on https://cs-25-sw-2-01.p2datsw.cs.aau.dk/node3/"
    );
  });
} else if (x === 2) {
  const PORT = 3000;
  server.listen(PORT, "0.0.0.0", () => {
    console.log("🚀 Server is listening on http://localhost:3000");
  });
}
