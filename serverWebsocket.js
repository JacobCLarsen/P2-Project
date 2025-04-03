import { authenticateJWT } from "./middleware_jwt.js";
import { splitTasks, dictionaryPath } from "./split-dictionary.js";

// Keep track of online users and client roles
let workerClientns = [];
let activeWorkers = [];
let dashboardClients = [];
let completedTaskCount = 0;
let taskQueue = [];
let taskcounter = 0;
let taskCounter = 0; // Counter for unique task IDs
let subtaskCounter = 0; // Counter for unique subtask IDs

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
          ws.send(JSON.stringify({ action: "updateQueue", queue: taskQueue }));
        } else {
          console.log("User tried to connect with unknow role. Kicking....");
          ws.close();
        }

        updateOnlineUsers();
        break;

      case "request task":
        if (taskQueue.length >= 1) {
          let task = taskQueue[0];
          if (task.completed === task.tasks.length) {
            console.log(`Task ${task.id} completed. Removing from queue.`);
            taskQueue.shift(); // Remove the completed task
            updateTaskQueue();
          } else {
            let subtask = task.tasks[task.completed];
            console.log(
              `Sending subtask ${subtask.id} of task ${task.id} to worker: ${message.id}`
            );

            ws.send(
              JSON.stringify({
                action: "new task",
                data: subtask,
                taskId: task.id,
                subtaskId: subtask.id,
              })
            );

            task.completed++; // Increment the completed subtasks count
            updateTaskQueue();
          }
        } else {
          ws.send(JSON.stringify({ action: "no more tasks" }));
          console.log("No more tasks in the queue ... ");
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
        console.log(
          `Result received for subtask ${message.subtaskId} of task ${message.taskId}: ${message.data}`
        );

        // Find the task in the queue
        let taskIndex = taskQueue.findIndex((t) => t.id === message.taskId);
        if (taskIndex !== -1) {
          let task = taskQueue[taskIndex];
          task.results.push({
            subtaskId: message.subtaskId,
            result: message.data,
          });

          // Check if all subtasks are completed
          if (task.results.length === task.tasks.length) {
            console.log(
              `All subtasks of task ${task.id} completed. Removing task.`
            );
            taskQueue.splice(taskIndex, 1); // Remove the task from the queue
            updateTaskQueue();
          }
        }

        completedTaskCount++;
        updateCompletedTasks();
        break;

      case "addTask":
        console.log("Splitting tasks based on active workers...");
        if (activeWorkers.length > 0) {
          const taskBatches = splitTasks(dictionaryPath, activeWorkers.length);
          taskCounter++;
          let task = {
            id: taskCounter, // Unique task ID
            completed: 0,
            tasks: [],
            results: [], // Store results for each subtask
          };
          taskBatches.forEach((batchContent) => {
            subtaskCounter++;
            const batch = {
              id: subtaskCounter, // Unique subtask ID
              data: batchContent,
            };
            task.tasks.push(batch);
          });
          addTaskToQueue(task);
          console.log(
            `Task ${task.id} with ${task.tasks.length} subtasks added to the queue.`
          );
        } else {
          console.warn("No active workers available to split tasks.");
        }
        break;

      case "clearQueue":
        taskQueue = [];
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
  taskQueue.push(task);

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
          queue: taskQueue.map((task) => ({
            id: task.id,
            completed: task.completed,
            total: task.tasks.length,
          })),
        })
      );
    }
  });
}
