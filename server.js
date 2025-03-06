const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const { Worker } = require("worker_threads");

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.use(express.static("public"));

function handleJoin() {
  const myWorker = new Worker("./public/worker.js");
  console.log("a user connected");
  io.emit("user join");
}

io.on("connection", (socket) => {
  handleJoin();
  socket.on("chat message", (msg) => {
    console.log("message: " + msg);
    io.emit("chat message", msg);
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(3000, "0.0.0.0", () => {
  console.log("listening on http://localhost:3000");
});
