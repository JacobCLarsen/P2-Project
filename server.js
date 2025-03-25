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
import { authenticateWebSocket } from "./middleware_jwt.js";

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

// Websockets:

const wss = new WebSocketServer({ port: 4311 });

wss.on("connection", function connection(ws) {
  ws.on("message", function incoming(data) {
    const message = JSON.parse(data);

    if (message.action === "connect") {
      authenticateWebSocket(message, (err, authenticatedMessage) => {
        if (err) {
          ws.send(JSON.stringify({ action: "error", message: err.message }));
          ws.close();
        } else {
          console.log("User authenticated:", authenticatedMessage.user);
          // Handle authenticated connection
        }
      });
    }

    // Handle other actions
  });
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
