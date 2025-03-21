export function fetchTask(mySocket) {
    let message = {
      action: "request task",
      data: null,
      id: "extension",
    };
  
    // When the server receives the message, it will send a task back to the client which will be received in the onmessage eventlistener above
    mySocket.send(JSON.stringify(message));
}

export function startWork(task, mySocket) {
      let taskresult = {
        action: "send result",
        data: "suckit",
      };
      mySocket.send(JSON.stringify(taskresult));
  
    // for demo - weight 2 seconds before fetching a new task
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