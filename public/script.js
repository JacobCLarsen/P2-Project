var socket = io();

var messages = document.getElementById("messages");
var form = document.getElementById("form");
var input = document.getElementById("input");

form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (input.value) {
    const myWorker = new Worker("worker.js");
    console.log("worker connected!");
    myWorker.postMessage(input.value);
    console.log(`Message containing ${input.value} was send to the a worker`);

    myWorker.onmessage = (e) => {
      console.log("Message received from worker:", e.data);
      socket.emit("chat message", e.data);
      input.value = "";
      myWorker.terminate();
    };
  }
});

socket.on("chat message", function (msg) {
  var item = document.createElement("li");
  item.textContent = msg;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});
