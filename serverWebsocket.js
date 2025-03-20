// Keep track of online users and client roles
let workerClientns = [];
let dashboardClients = [];

export function WebsocketListen(ws, wss) {
  ws.onmessage = (event) => {
    let message = JSON.parse(event.data);

    switch (message.action) {
      case "connect":
        console.log(`worker connected with id: ${message.id}`);

        // If the client specifies itself as a dashboard, add it to the dashboardClients list
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
export function createTask() {
  let task = {};
  task.id = Math.floor(Math.random().toString(36).substr(2, 9));
  task.hash = `0x${Math.random().toString(36).substr(2, 9)}`;
  return task;
}
