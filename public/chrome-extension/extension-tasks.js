// Function for fetching tasks
export function fetchTask(mySocket) {
    let message = {
        action: "request task",
        data: null,
        id: "extension",
    };
  
    // When the server receives the message, it will send a task back to the client
    mySocket.send(JSON.stringify(message));
}

// Function to start work
export function startWork(task, mySocket) {
    let taskresult = {
        action: "send result",
        data: "I did it!",
    };
    mySocket.send(JSON.stringify(taskresult));
  
    // for demo - wait 2 seconds before fetching a new task
    setTimeout(() => {
        chrome.storage.local.get("isWorking", function(data) {
            if (data.isWorking) {
                fetchTask(mySocket);
            } else {
                console.log("Task stopped. Not fetching a new task.");
            }
        });
    }, 2000);
}