import { authenticateJWT } from "./middleware_jwt.js";
import { Task } from "./createTask.js";
import { startNewTask } from "./startNewtask.js";
import { storeResult } from "./storeResults.js";

// Keep track of online users and client roles
let workerClientns = [];
let activeWorkers = [];
let dashboardClients = [];
let completedTaskCount = 0;
let mainTaskQueue = [];
let currentTaskQueue = [];
let taskWaitingForResult = [];
let dictionaryNumberOfBatches = 5;

export function WebsocketListen(ws, wss) {
  ws.onmessage = async (event) => {
    let message = JSON.parse(event.data);

    switch (message.action) {
      case "connect":
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
            console.log(
              "Worker client added. Total workers:",
              workerClientns.length
            );
          }
          ws.send(
            JSON.stringify({ action: "updateQueue", queue: mainTaskQueue })
          );
        } else {
          console.log("User tried to connect with unknow role. Kicking....");
          ws.close();
        }

        updateOnlineUsers();
        break;

      case "request task":
        console.log(`Client ${ws.id} requested a task`);

        // If there are no more subtasks for the current task, start working on the next task in the main queue
        if (currentTaskQueue.length === 0) {
          console.log(
            "no more tasks in current queue, checking main queue ... "
          );
          if (mainTaskQueue.length === 0) {
            // If no more tasks, print a message
            console.log("No more tasks in the main queue");
          } else {
            console.log("Task found - starting new task from main queue");
            let task = mainTaskQueue[0];
            console.log("shifted mainQueue");
            currentTaskQueue = startNewTask(task, dictionaryNumberOfBatches);
            console.log("set currentQueue to contain subtasks");
          }
        }

        // Remove the task from the top of the queue and send it to the user
        if (currentTaskQueue.length > 0) {
          console.log("tasks found in current queue");
          let taskToSend = currentTaskQueue.shift();
          taskWaitingForResult.push(taskToSend);
          console.log("defined a task to send");
          let taskMessage = {
            action: "new task",
            subTask: taskToSend,
          };
          console.log("defined the message");

          // Send the message to the client
          ws.send(JSON.stringify(taskMessage));

          console.log(
            `Task sent to the user with hashes: ${taskToSend.hashes}, dictionary list: ${taskToSend.dictionary}, and id: ${taskToSend.id}`
          );
        } else {
          console.log("No tasks available in the current task queue to send.");
        }

        break;

      case "start work":
        console.log(`${message.id} started working`);

        // Add the worker WebSocket to the activeWorkers array
        if (!activeWorkers.includes(ws)) {
          activeWorkers.push(ws);
        }

        console.log("active workers:", activeWorkers.length);
        updateOnlineUsers();
        break;

      case "stop work":
        console.log(`${message.id} stopped working`);

        // Remove the worker WebSocket from the activeWorkers array
        activeWorkers = activeWorkers.filter((client) => client !== ws);
        updateOnlineUsers();
        break;

      case "send result":
        console.log(`Result from worker received: ${message.result}`);
        // TODO: Add a check to see if the task was completed correctly or not

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
            mainTaskQueue[0].results.push(message.result);

            // Update the number of completed subtasks of the main task
            mainTaskQueue[0].subTasksCompleted++;

            if (
              mainTaskQueue[0].subTasksCompleted ===
              mainTaskQueue[0].numberBatches
            ) {
              // Use this completed task and store it somewhere
              let completed_task = mainTaskQueue.shift();
              console.log(
                `Task was completed with id: ${completed_task.id} and result ${completed_task.result}`
              );

              // Send the results of the task to the server
              storeResult(completed_task);
            }
          }

          console.log(`Task with ID ${message.taskId} marked as complete.`);
        } else {
          console.log(`No matching task found with ID ${message.taskId}.`);
        }

        // TODO: Check if all subtasks have been completed

        completedTaskCount++;
        updateTaskQueue();
        updateCompletedTasks();
        break;

      case "addTask":
        let testHashes = [
          "letmein",
          "password",
          "123456",
          "hello",
          "actualStrongPassword!!55",
        ];
        const task = new Task(testHashes, dictionaryNumberOfBatches);

        addTaskToQueue(task);
        break;

      case "clearQueue":
        mainTaskQueue = [];
        updateTaskQueue();
        break;

      case "disconnect":
        console.log(`worker disconnected with id: ${message.id}`);

        // Remove the worker WebSocket from both workerClientns and activeWorkers
        workerClientns = workerClientns.filter((client) => client !== ws);
        activeWorkers = activeWorkers.filter((client) => client !== ws);

        // Remove the client from the dashboardClients list if it disconnects
        dashboardClients = dashboardClients.filter((client) => client !== ws);

        // Notify only dashboard clients about the updated number of online users
        updateOnlineUsers();
        break;

      case "authenticate":
        const token = message.token;

        // Authenticate JWT token and get the user information
        const user = await authenticateJWT(token); // Using the async authenticateJWT
        console.log("User authenticated:", user);

        // Store the user information in the WebSocket instance
        ws.user = user;

        // Send a confirmation response back to the client
        ws.send(JSON.stringify({ action: "authenticated", user }));

        break;

      default:
        console.warn("Unknown message type:", message.action);
    }
  };
}

// function to create a random task to use in this file
function createTask() {
  let task = {};
  task.id = Math.floor(Math.random() * 1000);
  task.hash = `0x${Math.random().toString(36).slice(2, 11)}`;
  return task;
}

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
          count: completedTaskCount,
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
