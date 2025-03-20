/* Imports:
 * Express for API's/ routing
 * Socket.io (Websockets) are used for real time communication between the clients and the server
 * "require "./router"" specifies wherer to find the routes for the webpages
 */
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import router from "./router.js";
import { setupAuth } from "./setupAuth.js";
import { WebSocketServer } from "ws";
import { WebsocketListen } from "./serverWebsocket.js";

// Create Express App & Server:
const app = express();
const server = createServer(app);

// Create socket.io Server:
const io = new Server(server);

// Use the router for handling routes:
app.use("/", router);

// Define the path of public content:
app.use(express.static("public"));

// Websockets:
const wss = new WebSocketServer({ port: 4311 });

wss.on("connection", function connection(ws) {
  console.log("connected");
  // See which messages the websocket server is listening for in serverWebsocket.js
  WebsocketListen(ws);
});

// Set up Authentication Routes:
// setupAuth(app); // Calls the function to add login/signup routes

// Port for the Server:
server.listen(3311, "0.0.0.0", () => {
  console.log("listening on http://localhost:3000");
});
