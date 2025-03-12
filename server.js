const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const router = require("./router"); // Import the router

// Use the router for handling routes
app.use("/", router);

// Define the path of public content
app.use(express.static("public"));

let values = [1, 2, 3, 4, 5];
let taskNumber = 0;

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("disconnect", () => {
    console.log("a user disconnected");
    io.emit("user disconnect");
  });

  socket.on("request task", (text, id) => {
    console.log(`${text} - ${id}`);
    socket.emit("assigned task", {
      taskId: 123,
      value: values[taskNumber],
    });

    taskNumber = taskNumber < 4 ? taskNumber + 1 : 0;
  });

  socket.on("complete task", (msg) => {
    console.log(msg);
    io.emit("task result", msg);
  });
});

// Port for the server
server.listen(3000, "0.0.0.0", () => {
  console.log("listening on http://localhost:3000");
});
