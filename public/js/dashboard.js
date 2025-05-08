// Import the socket connection to the server
import { socket } from "./requireAuth.js";

// use socket object from require auth and set a clientId
const mySocket = socket;

// Send a message to identify this client as a dashboard on open
mySocket.addEventListener("open", () => {
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
const weakPasswordsField = document.getElementById("weakpasswordsFound");

// Receive message from the server to update online workes, active workers, and completed tasks in total since server restart
mySocket.onmessage = (event) => {
  let message = JSON.parse(event.data);
  console.log("Received message:", message); // Log the entire message for debugging

  switch (message.action) {
    case "updateOnlineUsers":
      onlineWorkersField.innerText = `Online workers: ${message.users}`;
      activeWorkersField.innerText = `Active workers: ${message.workers}`;
      console.log("Active Workers Count:", message.workers); // Log the count for debugging
      break;

    case "updateCompletedTasks":
      completedTasksField.innerText = `Completed tasks since restart: ${message.completedCount}`;
      weakPasswordsField.innerText = `Weak passwords found: ${message.weakPasswordCount}`;
      break;

    case "loadDashboard":
      onlineWorkersField.innerText = `Online workers: ${message.onlineClients}`;
      activeWorkersField.innerText = `Active workers: ${message.workers}`;
      completedTasksField.innerText = `Completed tasks since restart: ${message.completedTasks}`;
      weakPasswordsField.innerText = `Weak passwords found: ${message.weakPasswordCount}`;
      console.log("Active Workers Count (Dashboard):", message.workers); // Log for debugging
      break;

    default:
      console.warn("Unknown message type:", message.action);
  }
};
