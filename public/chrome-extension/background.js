// Script for receiving and running tasks in background

let isTaskRunning = false;
import { fetchTask, startWork } from "./extension-tasks.js";
const mySocket = new WebSocket("wss://cs-25-sw-2-01.p2datsw.cs.aau.dk/ws1/");

// Script for receiving tasks
mySocket.onmessage = (event) => {
    let message = JSON.parse(event.data);
  
    switch (message.action) {
        case "new task":
        console.log("Received new task:", message.data);
        startWork(message.data, mySocket);
        break;
  
        default:
        console.log("Error:", message.action);
    }
};

// Script for allowing the chrome extension to run in the background
chrome.runtime.onConnect.addListener(function (newPort) {
    console.log("Port connected:", newPort.name);

    newPort.onMessage.addListener(function (message) {
        if (message.action === "startTask") {
            if (!isTaskRunning) {
                console.log("Task started in background!");
                isTaskRunning = true;

                fetchTask(mySocket);

            } else {
                console.log("Task is already running.");
            }
        } else if (message.action === "stopTask") {
            if (isTaskRunning) {
                console.log("Task stopped in backgrond!");
                isTaskRunning = false;
            }
        }
    });

    newPort.onDisconnect.addListener(function () {
        console.log("Port disconnected");
    });
});