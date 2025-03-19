export function WebsocketListen(ws) {
  ws.onmessage = (event) => {
    let message = JSON.parse(event.data);

    switch (message.action) {
      case "connect":
        console.log(`worker connected with id: ${message.id}`);
        break;
      case "request task":
        console.log(
          `sending a task to worker: ${message.id}, with task id: ${task.taskID}`
        );
        ws.send(JSON.stringify({ action: "new task", data: task }));
        break;

      case "send result":
        console.log(`Result from worker recieved: ${message.data}`);
        break;

      case "disconnect":
        console.log("Stopping worker");
        self.close(); // Terminates the worker
        break;

      default:
        console.warn("Unknown message type:", type);
    }
  };
}

// This is an example task
const task = {
  id: 123,
  hash: "0x123",
};
