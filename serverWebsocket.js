export function WebsocketListen(ws) {
  ws.onmessage = (event) => {
    let message = JSON.parse(event.data);

    switch (message.action) {
      case "connect":
        console.log(`worker connected with id: ${message.id}`);
        break;
      case "request task":
        let task = createTask();
        console.log(
          `sending a task to worker: ${message.id}, with task id: ${task.id}`
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

// function to create a random task to use in this file
export function createTask() {
  let task = {};
  task.id = Math.floor(Math.random() * 1000);
  task.hash = `0x${Math.random().toString(36).substr(2, 9)}`;
  return task;
}
