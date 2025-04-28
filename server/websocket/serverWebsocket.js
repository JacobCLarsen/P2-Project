import { authenticateJWT } from "../middleware/middleware_jwt.js"; // Corrected path
import { Task } from "../tasks/createTask.js"; // Corrected path
import { startNewTask } from "../tasks/startNewtask.js"; // Corrected path
import { storeResult } from "../database/storeResults.js"; // Corrected path

// Keep track of online users and client roles
let workerClientns = [];
let activeWorkers = [];
let dashboardClients = [];
let completedTaskCount = 0;
let weakPasswordcount = 0;
let mainTaskQueue = [];
let currentTaskQueue = [];
let taskWaitingForResult = [];
let dictionaryNumberOfBatches = 5;

// Set up a listener for the server websocket connection
// Messages from client socket are object with an "action" and some data
// Switch statement check the action in the message and handles messages acordingly
export function WebsocketListen(ws, wss) {
  ws.onmessage = async (event) => {
    let message = JSON.parse(event.data);

    switch (message.action) {
      case "connect":
        handleConnection(ws, message);
        break;

      case "request task":
        handleRequestTask(ws);
        break;

      case "start work":
        handleStartWork(ws);
        break;

      case "stop work":
        handleStopWork(ws);
        break;

      case "send result":
        handleResultReceived(message);
        break;

      case "addTask":
        addDemoTask();
        break;

      case "add client task":
        const newClientTask = message.task;
        addTaskToQueue(newClientTask);
        break;

      case "clearQueue":
        mainTaskQueue = [];
        updateTaskQueue();
        break;

      case "disconnect":
        handleSocketDisconnect(ws);
        break;

      case "authenticate":
        authenticateUser(message, ws);
        break;

      default:
        console.warn("Unknown message type:", message.action);
    }
  };
}

// _______________________________________________________________________________________________________

// ---------------------------- Helper Functions For Handleing Events ------------------------------------
// _______________________________________________________________________________________________________

// Function to update the number of online users and send it to the dashboard clients
function updateOnlineUsers() {
  console.log("Updating online users..."); // Log when the function is called
  console.log("Worker Clients:", workerClientns.length);
  console.log("Active Workers:", activeWorkers.length);
  console.log("Dashboards:", dashboardClients.length);

  // Notify only dashboard clients about the updated number of online users
  dashboardClients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(
        JSON.stringify({
          action: "updateOnlineUsers",
          users: workerClientns.length,
          workers: activeWorkers.length,
        })
      );
    }
  });
}

// Function to update completed tasks and send it to the dashboard clients
function updateCompletedTasks() {
  dashboardClients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(
        JSON.stringify({
          action: "updateCompletedTasks",
          completedCount: completedTaskCount,
          weakPasswordCount: weakPasswordcount,
        })
      );
    }
  });
}

function loadDashBoard(ws) {
  ws.send(
    JSON.stringify({
      action: "loadDashboard",
      onlineClients: workerClientns.length,
      workers: activeWorkers.length,
      completedTasks: completedTaskCount,
      weakPasswordCount: weakPasswordcount,
    })
  );
}

// For demo, create 5 tasks and add them to the task queue, when a button is clicked
function addTaskToQueue(task) {
  // TODO: have a task queue on the database
  mainTaskQueue.push(task);

  // Send a message to clients to update their task queue
  updateTaskQueue();
}

// Function to update the task queue
function updateTaskQueue() {
  workerClientns.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(
        JSON.stringify({
          action: "updateQueue",
          queue: mainTaskQueue,
        })
      );
    }
  });
}

// Test function to add a demo task
function addDemoTask() {
  let testHashes = [
    "adfb6dd1ab1238afc37acd8ca24c1279f8d46f61907dd842faab35b0cc41c6e8ad84cbdbef4964b8334c22c4985c2387d53bc47e6c3d0940ac962f521a127d9f",
    "b109f3bbbc244eb82441917ed06d618b9008dd09b3befd1b5e07394c706a8bb980b1d7785e5976ec049b46df5f1326af5a2ea6d103fd07c95385ffab0cacbc86",
    "ba3253876aed6bc22d4a6ff53d8406c6ad864195ed144ab5c87621b6c233b548baeae6956df346ec8c17f5ea10f35ee3cbc514797ed7ddd3145464e2a0bab413",
    "9b71d224bd62f3785d96d46ad3ea3d73319bfbc2890caadae2dff72519673ca72323c3d99ba5c11d7c7acc6e14b8c5da0c4663475c2e5c3adef46f73bcdec043",
    "9b908be092ca0b280236d5335597b4b8502d408d3b09809c2aea7f3922ff355050bf9c498c2e4940cfb1b8cb13cc0671e95de7e38475e296ccb4ad1eb64a61f2",
    "2e8be0a37186094db6e2c7111385917a49d9dc34ec121d96caaddd49833d971ad1b12400a49b125166e2a1f1a7c06925bbbfb7f1c0e2fa625fd86fe84bd6982d",
  ];
  const task = new Task(testHashes, dictionaryNumberOfBatches);

  addTaskToQueue(task);
}

// When the user request a task, send them the next one in the current/subtask queue.
// If no tasks in the current queue start a new task form the main queue
function handleRequestTask(ws) {
  console.log(`Client ${ws.id} requested a task`);

  if (currentTaskQueue.length > 0) {
    assignTaskFromCurrentQueue(ws);
  } else if (taskWaitingForResult.length > 0) {
    reassignUncompletedTask(ws);
  } else if (mainTaskQueue.length > 0) {
    startNewMainTask();
    assignTaskFromCurrentQueue(ws);
  } else {
    notifyNoMoreTasks(ws);
  }
}

// Helper functions for handleRequestTask
function assignTaskFromCurrentQueue(ws) {
  console.log("Assigning task from current queue");
  let taskToSend = currentTaskQueue.shift();
  taskWaitingForResult.push(taskToSend);

  ws.send(
    JSON.stringify({
      action: "new task",
      subTask: taskToSend,
    })
  );

  console.log(`Task ${taskToSend.id} sent to the user`);
}

function reassignUncompletedTask(ws) {
  console.log("Reassigning uncompleted task");
  let taskToSend = taskWaitingForResult.shift();
  taskWaitingForResult.push(taskToSend);

  ws.send(
    JSON.stringify({
      action: "new task",
      subTask: taskToSend,
    })
  );

  console.log(`Uncompleted task ${taskToSend.id} reassigned`);
}

function startNewMainTask() {
  console.log("Starting new task from main queue");
  let task = mainTaskQueue[0];
  currentTaskQueue = startNewTask(task, dictionaryNumberOfBatches);
  console.log(`Current queue populated with subtasks from task ${task.id}`);
}

function notifyNoMoreTasks(ws) {
  console.log("No more tasks available");
  ws.send(JSON.stringify({ action: "no more tasks" }));
}

// When a socket sonnects, sets it's id on the serer and update "workerclients[]" and "dashboardclients[]"
function handleConnection(ws, message) {
  ws.id = message.id;
  console.log(
    `Client connected with id: ${message.id} and role: ${message.role}`
  );

  // Add dashboard and worker clients to their respective arrays
  if (message.role === "dashboard") {
    if (!dashboardClients.includes(ws)) {
      dashboardClients.push(ws);
      console.log(
        "Dashboard client added. Total dashboards:",
        dashboardClients.length
      );
    }
    // When a dashboard joins, send all the info to it (online users, active workers, tasks completed)
    loadDashBoard(ws);
  } else if (message.role === "worker") {
    if (!workerClientns.includes(ws)) {
      workerClientns.push(ws);
      console.log("Worker client added. Total workers:", workerClientns.length);
    }
    ws.send(JSON.stringify({ action: "updateQueue", queue: mainTaskQueue }));
  } else {
    console.log("User tried to connect with unknow role. Kicking....");
    ws.close();
  }

  updateOnlineUsers();
}

// When a client start working, update the dashboard
function handleStartWork(ws) {
  console.log(`${ws.id} started working`);

  // Add the worker WebSocket to the activeWorkers array
  if (!activeWorkers.includes(ws)) {
    activeWorkers.push(ws);
  }

  console.log("active workers:", activeWorkers.length);
  updateOnlineUsers();
}

// When a user stops working, update the dashboard
function handleStopWork(ws) {
  console.log(`${ws.id} stopped working`);

  // Remove the worker WebSocket from the activeWorkers array
  activeWorkers = activeWorkers.filter((client) => client !== ws);
  updateOnlineUsers();
}

// When result is received from a client, varify the task was completed correctly, remove the task from "waiting for result" array,
// and store weak hashes in the database
// TODO: Add a check to see if the task was completed correctly or not
// TODO: Check if all subtasks have been completed
function handleResultReceived(message) {
  // Check if a result was received or no weak passwords were found
  if (!message.result) {
    console.log(
      `Result received from the worker: No passwords found in subtask: ${message.taskId}`
    );
  } else {
    console.log(`Result from worker received: ${message.result}`);
    weakPasswordcount += message.result.length; // Update weakPasswordsFoundCounter for dashboard.html

    // Scan the currentTaskQueue for a matching task ID and mark completed
    let matchingTask = taskWaitingForResult.find(
      (task) => task.id === message.taskId
    );

    if (matchingTask) {
      // Check if the task was completed already for chatching erroes
      if (matchingTask.completed === 1) {
        console.log(`ERROR: Task ${matchingTask.id} was already completed`);
      } else {
        // Call complete() on the matching subtask
        matchingTask.complete();

        // Remove from taskWatingForResult
        taskWaitingForResult = taskWaitingForResult.filter(
          (task) => task.id !== matchingTask.id
        );

        // Push results to the task object's array for results
        if (mainTaskQueue[0].results) {
          mainTaskQueue[0].results.push(message.result);
          mainTaskQueue[0].subTasksCompleted++; // Update the number of completed subtasks of the main task

          // If the whole task is now completed
          if (
            mainTaskQueue[0].subTasksCompleted ===
            mainTaskQueue[0].numberBatches
          ) {
            // Use this completed task and store it somewhere
            let completed_task = mainTaskQueue.shift();
            console.log(
              `Task was completed with id: ${completed_task.id} and result ${completed_task.results}`
            );

            // Send the results of the task to the server
            storeResult(completed_task);
          }
        } else {
          console.log(
            `Task ${message.taskId} has already been completed by another node and removed from the task queue`
          );
        }
      }

      console.log(`Subtask with ID ${message.taskId} marked as complete.`);
    } else {
      console.log(`No matching task found with ID ${message.taskId}.`);
    }
  }

  // Update completed task counter and taskqueue for dashboard and clients
  completedTaskCount++;
  updateTaskQueue();
  updateCompletedTasks();
}

// When a socket disconnects (closes the browser tap), remove them from arays and update the dashboard
function handleSocketDisconnect(ws) {
  console.log(`worker disconnected with id: ${ws.id}`);

  // Remove the worker WebSocket from both workerClientns and activeWorkers
  workerClientns = workerClientns.filter((client) => client !== ws);
  activeWorkers = activeWorkers.filter((client) => client !== ws);

  // Remove the client from the dashboardClients list if it disconnects
  dashboardClients = dashboardClients.filter((client) => client !== ws);

  // Notify only dashboard clients about the updated number of online users
  updateOnlineUsers();
}

// Authenticate user
async function authenticateUser(message, ws) {
  const token = message.token;

  // Authenticate JWT token and get the user information
  const user = await authenticateJWT(token); // Using the async authenticateJWT
  console.log("User authenticated:", user);

  // Store the user information in the WebSocket instance
  ws.user = user;

  // Send a confirmation response back to the client
  ws.send(JSON.stringify({ action: "authenticated", user }));
}
