// Script for allowing chrome extension to run in background
let isTaskRunning = false;

chrome.runtime.onConnect.addListener(function (newPort) {
    console.log("Port connected:", newPort.name);

    newPort.onMessage.addListener(function (message) {
        if (message.action === "startTask") {
            if (!isTaskRunning) {
                console.log("Task started in background!");
                isTaskRunning = true;

                startBackgroundTask();

            } else {
                console.log("Task is alreade running.");
            }
        } else if (message.action === "stopTask") {
            if (isTaskRunning) {
                console.log("Task stopped in backgrond!");
                isTaskRunning = false;

                stopBackgroundTask();

            }
        }
    });

    newPort.onDisconnect.addListener(function () {
        console.log("Port disconnected");
    });
});

function startBackgroundTask() {
    console.log("Performing background task!");
}

function stopBackgroundTask() {
    console.log("Stopped backgournd task!");
}
