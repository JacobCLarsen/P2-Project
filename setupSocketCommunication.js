export function setupSocketCommunication(io) {
  // Tasks for proof of concept
  let values = [1, 2, 3, 4, 5];
  let taskNumber = 0;

  // Keep track of active workers
  let activeWorkers = 0;

  // When a user starts working it should be logged and the activeWorkers variables is updated
  function handleStartWork() {
    activeWorkers++;
  }

  // io.on("connections") runs when a client is connected.
  io.on("connection", (socket) => {
    console.log("a user connected");

    // Handle User Disconnect:
    // When a client disconnets log it and emit "user disconnected" to all socket.
    // Todo: right now "user disconnected is not used anywhere"
    socket.on("disconnect", () => {
      console.log("a user disconnected");
      io.emit("user disconnect");
    });

    // Handle Task Request:
    socket.on("request task", (text, id) => {
      console.log(`${text} - ${id}`);
      // Send the task to the client with "assigned task". The client reads the task object when it revices a "assgiend task" message
      socket.emit("assigned task", {
        taskId: 123,
        value: values[taskNumber],
      });
      taskNumber = taskNumber < 4 ? taskNumber + 1 : 0;
    });

    // Handle Task Completion:
    // When the server receives a completed tas, emit it to all sockets
    socket.on("complete task", (msg) => {
      console.log(msg);
      io.emit("task result", msg);
    });
  });
}
