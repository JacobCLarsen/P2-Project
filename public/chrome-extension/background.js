// Script for receiving and running tasks in background

let isTaskRunning = false;
import { fetchTask, startWork } from "./extension-tasks.js";
const mySocket = new WebSocket("wss://cs-25-sw-2-01.p2datsw.cs.aau.dk/ws2/");

// Script for receiving tasks
mySocket.onmessage = (event) => {
    let message = JSON.parse(event.data);
  
    switch (message.action) {
        case "new task":
        console.log("Received new task:", message.subTask);
        startWork(message.subTask, mySocket);
        break;
  
        default:
        console.log("Error:", message.action);
    }
};

// Script for allowing the chrome extension to run in the background

// Listen for connections from other parts of the Chrome extension
chrome.runtime.onConnect.addListener(function (newPort) {
    console.log("Port connected:", newPort.name);

    // Listen for messages from the connected port
    newPort.onMessage.addListener(function (message) {
        if (message.action === "startTask") {
            // Start a new task if no task is currently running
            if (!isTaskRunning) {
                console.log("Task started in background!");
                isTaskRunning = true;
                fetchTask(mySocket);
            } else {
                console.log("Task is already running.");
            }
        } else if (message.action === "stopTask") {
            // Stop the current task if one is running
            if (isTaskRunning) {
                console.log("Task stopped in background!");
                isTaskRunning = false;
            }
        }
    });

    // Handle the disconnection of the port
    newPort.onDisconnect.addListener(function () {
        console.log("Port disconnected");
    });
});

