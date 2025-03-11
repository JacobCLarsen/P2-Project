const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// Define the URL for the worker to join "/"
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/html/workerpage.html");
});

// Define the path of public content
app.use(express.static("public"));

let values = [1, 2, 3, 4, 5];
let taskNumber = 0;

// When the user joins ...
function handleJoin() {
  console.log("a user connected");
}

// When the user disconnects ...
function handleDisconnect() {
  console.log("a user disconnected");
  io.emit("user disconnect");
}

// When a user gets connections to the URL ...
io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    handleDisconnect();
  });
  socket.on("request task", (text, id) => {
    console.log(`${text} - ${id}`);
    socket.emit("assigned task", {
      taskId: 123,
      value: values[taskNumber],
    });
    if (taskNumber < 4) {
      taskNumber++;
    } else {
      taskNumber = 0;
    }
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
