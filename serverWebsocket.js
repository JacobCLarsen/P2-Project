// Keep track of online users and client roles
let workerClientns = [];
let dashboardClients = [];
let completedTaskCount = 0;

export function WebsocketListen(ws, wss) {
  ws.onmessage = (event) => {
    let message = JSON.parse(event.data);

    switch (message.action) {
      case "connect":
        console.log(`worker connected with id: ${message.id}`);
        updateOnlineUsers(message);
        break;

      case "request task":
        let task = createTask();
        console.log(
          `sending a task to worker: ${message.id}, with task id: ${task.id}`
        );
        ws.send(JSON.stringify({ action: "new task", data: task }));
        break;

      case "send result":
        console.log(`Result from worker received: ${message.data}`);
        // TODO: Add a check to see if the task was completed correctly or not
        completedTaskCount++;
        updateCompletedTasks();
        break;

      case "disconnect":
        console.log(`worker disconnected with id: ${message.id}`);
        workerClientns = workerClientns.filter((id) => id !== message.id);

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
function updateOnlineUsers(message) {
  if (message.role === "dashboard") {
    dashboardClients.push(ws);
  } else {
    workerClientns.push(message.id);
  }

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
