var socket = io();
<<<<<<< Updated upstream

var startBtn = document.getElementById("startBtn");
var taskList = document.getElementById("tasks");
var taskResults = document.getElementById("taskResults");
=======
var userCount = document.getElementById("userCount");
>>>>>>> Stashed changes

startBtn.addEventListener("click", function () {
  if (startBtn.innerText == "Request task") {
    startBtn.innerText = "working ... ";
    setTimeout(() => {
      startWork();
      startBtn.innerText = "Request task";
    }, "1000");
  } else {
    startBtn.innerText = "Request task";
  }
});

function stopWork(result) {
  socket.emit("stop work");
}

function startWork() {
  fetchTask();
}

async function fetchTask() {
  socket.emit("request task", "A worker wants to do a task");
}

socket.on("assigned task", (task) => {
  completeTask(task);
});

<<<<<<< Updated upstream
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
      `task ${task.value} completed with result ${e.data}`
    );
  };
}

socket.on("task result", (msg) => {
  let result = document.createElement("li");
  result.innerText = msg;
  taskResults.append(result);
=======
socket.on("user join", function () {
  counter = Number(userCount.innerText) + 1;
  userCount.innerText = counter;
  console.log("recieved");
>>>>>>> Stashed changes
});

socket.on("user disconnect", function () {
  counter = Number(userCount.innerText) + -1;
  userCount.innerText = counter;
  console.log("recieved");
});

