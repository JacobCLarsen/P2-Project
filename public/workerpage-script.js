// Create a socket client using io()
var socket = io();

//Send the name to the server after connecting
socket.emit("set_name", "USER TEMP");

// Get elements from the HTML-page
var startBtn = document.getElementById("startBtn");
var taskList = document.getElementById("tasks");
var taskResults = document.getElementById("taskResults");

// clicking "Start working " will start work form this client
startBtn.addEventListener("click", function () {
  if (startBtn.innerText == "Start Working") {
    startBtn.innerText = "Working ... (click to stop)";
    startWork();
  } else {
    startBtn.innerText = "Start Working";
    stopWork();
  }
});

// When work stops, emit it to the server
function stopWork(result) {
  socket.emit("stop work");
}

// Starting work will fetch a task
function startWork() {
  socket.emit("start work");
  fetchTask();
}

// To fetch a task, we use socket.emit to send a message to the server asking for a task
async function fetchTask() {
  socket.emit("request task", "A worker wants to do a task");
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
    taskList.innerHTML = "";
    taskList.append(item);
    socket.emit(
      "complete task",
      `task ${task.value} completed with result ${e.data} from node ${task.username}`
    );
  };

  // Start working again
  setTimeout(() => {
    if (startBtn.innerText == "Working ... (click to stop)") {
      fetchTask();
    }
  }, "2000");
}

// When a task i completed by another client, it is send to all clients so show on the GUI
socket.on("task result", (msg) => {
  let result = document.createElement("li");
  result.innerText = msg;
  taskResults.append(result);
});
