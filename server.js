/** Imports
 * Express for API's/ routing
 * Socket.io (Websockets) are used for real time communication between the clients and the server
 * "require "./router"" specifies wherer to find the routes for the webpages
 */
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import router from "./router.js";
import { setupSocketCommunication } from "./setupSocketCommunication.js";

// Create Express App & Server:
const app = express();
const server = createServer(app);

// Create socket.io Server:
const io = new Server(server);

// Use the router for handling routes:
app.use("/", router);

// Define the path of public content:
app.use(express.static("public"));

// Set up Socket Communication:
setupSocketCommunication(io);

// Port for the Server:
server.listen(3000, "0.0.0.0", () => {
  console.log("listening on http://localhost:3000");
});
