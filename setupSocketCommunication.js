export function setupSocketCommunication(io) {
  // Tasks for proof of concept
  let values = [1, 2, 3, 4, 5];
  let taskNumber = 0;

  // Keep track of active workers
  let activeWorkers = 0;
  let activeWorkersArray = [];

  // Function to remove an element fro array
  function removeElement(element) {
    let index = activeWorkersArray.indexOf(element);
    let x = activeWorkersArray.splice(index, 1);

    activeWorkers = activeWorkersArray.length;
  }

  // io.on("connections") runs when a client is connected.
  io.on("connection", (socket) => {
    console.log("a user connected");
    io.emit("worker amount change", activeWorkers);

    // When a user starts working, increment workingUsers by one
    socket.on("start work", () => {
      activeWorkers++;
      activeWorkersArray.push(socket.id);
      console.log(`User with id: ${socket.id} started work`);
      io.emit("worker amount change", activeWorkers);
    });

    // When a user starts working, decrements workingSsers by one
    socket.on("stop work", () => {
      activeWorkers--;
      removeElement(socket.id);
      console.log(`User with id: ${socket.id} stopped working`);
      io.emit("worker amount change", activeWorkers);
    });

    // Handle User Disconnect:
    // When a client disconnets log it and emit "user disconnected" to all socket.
    // Todo: right now "user disconnected is not used anywhere"
    socket.on("disconnect", () => {
      if (activeWorkersArray.includes(socket.id, 0)) {
        removeElement(socket.id);
        io.emit("worker amount change", activeWorkers);
      }
      console.log(`a user disconnected with id: ${socket.id}`);
    });

    // Handle Task Request:
    socket.on("request task", (text) => {
      console.log(`${text} - ${socket.id}`);
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
