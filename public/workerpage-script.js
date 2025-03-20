// Get elements from the HTML-page
const startBtn = document.getElementById("startBtn");
const startBtnText = document.getElementById("startBtnContent");
const startBtnLoad = document.getElementById("startBtnLoad");
const messageBox = document.getElementById("messageBox");
const taskList = document.getElementById("tasks");
const taskResults = document.getElementById("taskResults");
const statusMessage = document.getElementById("workstatus");
const hashingText = document.getElementById("hashingText");
const plusTabBtn = document.getElementById("plus-tab-btn");

// Create a websocket client and generate a random ID for it. Later to be replaced with a user id from mySQL
//const mySocket = new WebSocket("ws://localhost/ws1/");
const mySocket = new WebSocket("wss://cs-25-sw-2-01.p2datsw.cs.aau.dk/ws1/");

const clientId = `client-${Math.random().toString(36).substr(2, 9)}`;

// Send the name to the server after connecting
mySocket.addEventListener("open", (event) => {
  let message = {
    action: "connect",
    data: null,
    id: clientId, // Use the generated client ID
  };
  mySocket.send(JSON.stringify(message));
});

// On clone send a messag to the server that the client is disconnected
mySocket.addEventListener("close", (event) => {
  let message = {
    action: "disconnect",
    data: null,
    id: clientId, // Use the generated client ID
  };
  mySocket.send(JSON.stringify(message));
});

// Listen for messages from the server, switch case to handle different message "action" types
mySocket.onmessage = (event) => {
  let message = JSON.parse(event.data);

  switch (message.action) {
    case "new task":
      console.log("Received new task:", message.data);
      startWork(message.data);
      break;

    default:
      console.warn("Unknown message type:", type);
  }
};

// Send a message to the server to fetch a task
function fetchTask() {
  let message = {
    action: "request task",
    data: null,
    id: clientId,
  };

  // When the server receives the message, it will send a task back to the client which will be received in the onmessage eventlistener above
  mySocket.send(JSON.stringify(message));
}

// Start working involves, fetching a task, creating a worker to complete the task and sending the result back to the server
function startWork(task) {
  const myWorker = new Worker("worker.js");
  console.log("worker connected!");
  myWorker.postMessage(task.hash);
  console.log(`Message containing ${task.hash} was send to the a worker`);

  myWorker.onmessage = (e) => {
    let taskresult = {
      action: "send result",
      data: e.data,
    };
    console.log("Message received from worker:", e.data);
    myWorker.terminate();

    let item = document.createElement("li");
    item.innerText = `You completed task ${task.id} with result ${e.data}`;
    taskList.innerHTML = "";
    taskList.append(item);

    mySocket.send(JSON.stringify(taskresult));
  };

  // for demo - weight 2 seconds before fetching a new task
  setTimeout(() => {
    if (startBtnText.innerText == "Hashing passwords") {
      fetchTask();
    }
  }, 2000);
}

// Animate the work button, when working.
function startWorkUI() {
  // Distaplay the message "Please dont leave the page when working, and also adds a beforeunloadHandeler to the window
  window.addEventListener("beforeunload", beforeReloadHandeler);
  messageBox.style.display = "block";
  startBtnText.innerText = "Hashing passwords";

  // Loading function to the
  let dots = "";
  const interval = setInterval(() => {
    if (startBtnText.innerText !== "Hashing passwords") {
      clearInterval(interval);
      startBtnLoad.innerText = "";
      return;
    }
    dots = dots.length < 4 ? dots + "." : ".";
    startBtnLoad.innerText = dots;
  }, 600);

  // Set the color of the button to blue
  startBtn.style.border = "#007bff solid 2px";
  startBtnText.style.color = "#007bff";
  startBtnLoad.style.color = "#007bff";

  // Navigation links should open in a new window
  document.querySelectorAll("a").forEach((link) => {
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
  });
}

function stopWork() {
  stopWorkUI();
}

function stopWorkUI() {
  // Remove the message and the beforeunloadHandler from the window
  window.removeEventListener("beforeunload", beforeReloadHandeler);
  // Hide the messsage box
  messageBox.style.display = "none";
  startBtnText.innerText = "Click to start working";
  startBtnLoad.innerText = "";
  // Revert to default (hover-only)
  startBtn.style.border = "";
  startBtnText.style.color = "";
  startBtnLoad.style.color = "";

  // Navigation links can now open in the same window
  document.querySelectorAll("a").forEach((link) => {
    link.removeAttribute("target", "_blank");
    link.removeAttribute("rel", "noopener noreferrer");
  });
}

// Alert the user when they try to leave to reload the page while working. This function is added to the workbutton eventlistener
function beforeReloadHandeler(event) {
  event.preventDefault();
}

// clicking "Start working " will start work form this client
startBtn.addEventListener("click", function () {
  if (startBtnText.innerText == "Click to start working") {
    fetchTask();
    startWorkUI();
  } else {
    stopWork();
  }
});
