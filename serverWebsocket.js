import { authenticateJWT } from "./middleware_jwt.js";

// Keep track of online users and client roles
let workerClientns = [];
let dashboardClients = [];
let completedTaskCount = 0;
let taskQueue = [];

export function WebsocketListen(ws, wss) {
  ws.onmessage = async (event) => {
    let message = JSON.parse(event.data);

    switch (message.action) {
      case "connect":
        console.log(`worker connected with id: ${message.id}`);
        // Add dashboard and worker clients to an array
        if (message.role === "dashboard") {
          dashboardClients.push(ws);
          // When a dashboard joins, send all the info to it (online users, active workers, tasks completd)
          loadDashBoard(ws);
        } else {
          workerClientns.push(ws);
          ws.send(JSON.stringify({ action: "updateQueue", queue: taskQueue }));
        }

        updateOnlineUsers();
        break;

      case "request task":
        // If there are tasks in the queue, send the oldest one to the client to solve and remove it from the queue
        if (taskQueue.length >= 1) {
          let task = taskQueue.shift();
          console.log(
            `sending a task to worker: ${message.id}, with task id: ${task.id}`
          );
          ws.send(JSON.stringify({ action: "new task", data: task }));
        } else {
          ws.send(JSON.stringify({ action: "no more tasks" }));
          console.log("No more tasks in the queue ... ");
        }
        // Also send a message to all clients to update the taskqeueu, as a task now as been taken
        updateTaskQueue();
        break;

      case "send result":
        console.log(`Result from worker received: ${message.data}`);
        // TODO: Add a check to see if the task was completed correctly or not
        completedTaskCount++;
        updateCompletedTasks();
        break;

      case "addTask":
        console.log("new task is being created");
        let newTask = createTask();
        addTaskToQueue(newTask);
        break;

      case "clearQueue":
        taskQueue = [];
        updateTaskQueue();
        break;

      case "disconnect":
        console.log(`worker disconnected with id: ${message.id}`);
        workerClientns = workerClientns.filter((client) => client !== ws);

        // Remove the client from the dashboardClients list if it disconnects
        dashboardClients = dashboardClients.filter((client) => client !== ws);

        // Notify only dashboard clients about the updated number of online users
        dashboardClients.forEach((client) => {
          if (client.readyState === client.OPEN) {
            client.send(
              JSON.stringify({
                action: "updateOnlineUsers",
                users: workerClientns.length,
              })
            );
          }
        });
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
  // Notify only dashboard clients about the updated number of online users
  dashboardClients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(
        JSON.stringify({
          action: "updateOnlineUsers",
          users: workerClientns.length,
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
          queue: taskQueue,
        })
      );
    }
  });
}
