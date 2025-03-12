/** Imports
 * Express for API's/ routing
 * Socket.io (Websockets) are used for real time communication between the clients and the server
 * "require "./router"" specifies wherer to find the routes for the webpages
 */
import express from "express";
const app = express();
import { createServer } from "http";
const server = createServer(app);
import { Server } from "socket.io";
const io = new Server(server);
import router from "./router.js";

// Use the router for handling routes
app.use("/", router);

// Define the path of public content
app.use(express.static("public"));

// Tasks for proff of concept
let values = [1, 2, 3, 4, 5];
let taskNumber = 0;

// io.on("connections") runs when a client is connected.
io.on("connection", (socket) => {
  console.log("a user connected");

  // When a client disconnets log it and emit "user disconnected" to all socket.
  // Todo: right now "user disconnected is not used anywhere"
  socket.on("disconnect", () => {
    console.log("a user disconnected");
    io.emit("user disconnect");
  });

  // When a socket request a task, send the next task in the
  socket.on("request task", (text, id) => {
    console.log(`${text} - ${id}`);
    // Send the task to the client with "assigned task". The client reads the task object when it revices a "assgiend task" message
    socket.emit("assigned task", {
      taskId: 123,
      value: values[taskNumber],
    });
    taskNumber = taskNumber < 4 ? taskNumber + 1 : 0;
  });

  // When the server receives a completed tas, emit it to all sockets
  socket.on("complete task", (msg) => {
    console.log(msg);
    io.emit("task result", msg);
  });
});

// Port for the server
server.listen(3000, "0.0.0.0", () => {
  console.log("listening on http://localhost:3000");
});
