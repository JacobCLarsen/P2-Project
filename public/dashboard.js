// Create a socket client and connect to the server
const mySocket = new WebSocket("wss://cs-25-sw-2-01.p2datsw.cs.aau.dk/ws1/");

mySocket.addEventListener("open", () => {
  // Send a message to identify this client as a dashboard
  mySocket.send(
    JSON.stringify({
      action: "connect",
      role: "dashboard", // Specify the role
      id: "dashboard",
    })
  );
});

// Get elements from the dom
const onlineWorkersField = document.getElementById("online-workers");
const activeWorkersField = document.getElementById("active-workers");
const completedTasksField = document.getElementById("completed-tasks");

// Receive message from the server to update online workes, active workers, and completed tasks in total since server restart
mySocket.onmessage = (event) => {
  let message = JSON.parse(event.data);

  switch (message.action) {
    case "updateOnlineUsers":
      onlineWorkersField.innerText = `Online workers: ${message.users}`;
      activeWorkersField.innerText = `Active workers: ${message.activeUsers.length}`;
      break;

    case "updateCompletedTasks":
      completedTasksField.innerText = `Completed tasks since restart: ${message.count}`;
      break;

    case "loadDashboard":
      onlineWorkersField.innerText = `Online workers: ${message.onlineClients}`;
      completedTasksField.innerText = `Completed tasks since restart: ${message.completedTasks}`;
      break;

    default:
      console.warn("Unknown message type:", type);
  }
};
