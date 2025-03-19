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
import DBConnection, { connectToDatabase } from "./databaseConnection.js"; // Import DB connection function

// Define the path of the current file and directory:
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

// Set up Authentication Routes:
setupAuth(app); // Calls the function to add login/signup routes

// Connect to the database:
connectToDatabase();

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


// Set up Authentication Routes:
setupAuth(app); // Calls the function to add login/signup routes





app.use(express.json());

// Simple test route
app.get("/", (req, res) => {
    res.send("Server is running!");
});


// Check database connection
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
  console.log("listening on http://localhost:3310");
});
*/