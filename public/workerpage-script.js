// Create a socket client using io()
const socket = io();

//Send the name to the server after connecting
socket.emit("set_name", "USER TEMP");

// Get elements from the HTML-page
var startBtn = document.getElementById("btn-container");
var startBtnText = document.getElementById("startBtn");
var taskList = document.getElementById("tasks");
var taskResults = document.getElementById("taskResults");
var statusMessage = document.getElementById("workstatus");
var hashingText = document.getElementById("hashingText");
var plusTabBtn = document.getElementById("plus-tab-btn");

// Alert the user when they try to leave to reload the page while working. This function is added to the workbutton eventlistener
function beforeReloadHandeler(event) {
  event.preventDefault();
}

// clicking "Start working " will start work form this client
startBtn.addEventListener("click", function () {
  if (startBtnText.innerText == "Click to start working") {
    startBtnText.innerText = "Hashing hashes ...";
    startWork();
    hashAnimation();
  } else {
    startBtnText.innerText = "Click to start working";
    stopWork();
  }
});

// Starting work will fetch a task
function startWork() {
  workStartedUI();
  fetchTask();
}

// When work stops, emit it to the server
function stopWork(result) {
  workStoppedUI();
  socket.emit("stop work");
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
    item.innerText = `You completed task ${task.value} with result ${e.data}`;
    taskList.innerHTML = "";
    taskList.append(item);
    socket.emit(
      "complete task",
      `Task ${task.value} completed with result: ${e.data} from node: ${task.username} with id: ${socket.id}`
    );
  };

  // Start working again
  setTimeout(() => {
    if (startBtnText.innerText === "Hashing hashes ...") {
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

// Function to open af new tab to work on antoher page
plusTabBtn.addEventListener("click", function () {
  window.open("startwork", "_blank");
});

// ************ Cosmetic functions ************
// Function to handle UI changes on work start
function workStartedUI() {
  startBtnText.innerText = "Hashing hashes ...";
  startBtnText.style.color = "#007bff";
  startBtn.style.border = "2px solid #007bff";
  // Add eventlistener to alert the user before leaving the page
  window.addEventListener("beforeunload", beforeReloadHandeler);
  // When working navigation to a new page should open it in a new window
  document.querySelectorAll("a").forEach((link) => {
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
  });
  plusTabBtn.style.display = "block";
}

// Function to handle UI changes on work stop
function workStoppedUI() {
  startBtnText.innerText = "Click to start working";
  startBtnText.style.color = "#444";
  startBtn.style.border = "2px solid #444";
  hashingText.innerText = "";
  // The user is safe to leave the page, as no work is being done
  window.removeEventListener("beforeunload", beforeReloadHandeler);
  // When not working, tabs are opened in the same window
  document.querySelectorAll("a").forEach((link) => {
    link.removeAttribute("target", "_blank");
    link.removeAttribute("rel", "noopener noreferrer");
  });
  plusTabBtn.style.display = "none";
}

// Function to animate the hashing text
const letters = "ABCTUVWXYZ$#!%&/()=?*";
let interval = null;

function hashAnimation() {
  hashingText.innerText = "0000000000";
  let iteration = 0;

  clearInterval(interval);

  interval = setInterval(() => {
    hashingText.innerText = hashingText.innerText
      .split("")
      .map((letter, index) => {
        return letters[Math.floor(Math.random() * letters.length)];
      })
      .join("");

    iteration += 1 / 3;
  }, 100);
}
