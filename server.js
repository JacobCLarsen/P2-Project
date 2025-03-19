/* Imports:
 * Express for API's/ routing
 * Socket.io (Websockets) are used for real time communication between the clients and the server
 * "require "./router"" specifies wherer to find the routes for the webpages
 */
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import router from "./router.js";
import { setupSocketCommunication } from "./setupSocketCommunication.js";
import { setupAuth } from "./setupAuth.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express App & Server:
const app = express();
const server = createServer(app);

// Create socket.io Server with a custom path:
const io = new Server(server, {
  path: "/node0/socket.io", // Set the path to include the proxy prefix
});

// Use the router for handling routes:
app.use("/", router);

// Define the path of public content dynamically based on the base URL:
app.use((req, res, next) => {
  if (!req.path.startsWith("/socket.io")) {
    express.static(path.join(__dirname, "public"))(req, res, next);
  } else {
    next(); // Skip static middleware for socket.io paths
  }
});

// Test
// Explicitly handle the socket.io path:
app.use("/socket.io", (req, res, next) => {
  next(); // Allow socket.io to handle its own requests
});

// Set up Socket Communication:
setupSocketCommunication(io);

// Set up Authentication Routes:
setupAuth(app); // Calls the function to add login/signup routes

// Port for the Server:
server.listen(3310, "0.0.0.0", () => {
  console.log("listening on http://localhost:3310");
});
