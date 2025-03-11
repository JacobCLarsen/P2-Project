import { v4 as uuidv4 } from "https://cdn.jsdelivr.net/npm/uuid@8.3.2/+esm";

var socket = io();

// Generate node id
let nodeId = uuidv4();
console.log(`Generated id: ${nodeId}`);

// Get element from the HTML-page
var startBtn = document.getElementById("startBtn");
var taskList = document.getElementById("tasks");
var taskResults = document.getElementById("taskResults");

// clicking "Request task" will start work form this client
startBtn.addEventListener("click", function () {
  if (startBtn.innerText == "Start Working") {
    startBtn.innerText = "Working ... (click to stop session)";
    startWork();
  } else {
    startBtn.innerText = "Start Working";
  }
});

// For fun loading function for when work is started
function loading() {
  setTimeout(() => {
    startBtn.innerText = "Breaking hashes ..";
    setTimeout(() => {
      startBtn.innerText = "Breaking hashes ...";
      setTimeout(() => {
        startBtn.innerText = "Breaking hashes .";
      }, "500");
    }, "500");
  }, "500");
}

// When work stops, emit it to the server
// TODO: Change it so that the serves uses this information to keep track of haw many resources it has available
function stopWork(result) {
  socket.emit("stop work");
}

// Starting work will fetch a task
function startWork() {
  fetchTask();
}

// To fetch a task, we use socket.emit to send a message to the server asking for a task
async function fetchTask() {
  socket.emit("request task", "A worker wants to do a task", nodeId);
}

// When the client recieves a message with an "assigned task", it will use the data send in the message and complete the task
socket.on("assigned task", (task) => {
  completeTask(task);
});

// Completing a task is done by initializing a worker, passing data to the worker using .postmessage and receive the data using .onmessage.
function completeTask(task) {
  const myWorker = new Worker("worker.js");
  console.log("worker connected!");
  myWorker.postMessage(task.value);
  console.log(`Message containing ${task.value} was send to the a worker`);

  myWorker.onmessage = (e) => {
    console.log("Message received from worker:", e.data);
    myWorker.terminate();

    let item = document.createElement("li");
    item.innerText = `you completed task ${task.value} with result ${e.data}`;
    taskList.append(item);
    socket.emit(
      "complete task",
      `task ${task.value} completed with result ${e.data} from node ${nodeId}`
    );
  };

  // Start working again
  setTimeout(() => {
    if (startBtn.innerText == "Working ... (click to stop session)") {
      startWork();
    }
  }, "2000");
}

// When a task i completed by another client, it is send to all clients so show on the GUI
socket.on("task result", (msg) => {
  let result = document.createElement("li");
  result.innerText = msg;
  taskResults.append(result);
});

socket.on("user disconnect", function () {
  counter = Number(userCount.innerText) + -1;
  userCount.innerText = counter;
  console.log("recieved");
});
