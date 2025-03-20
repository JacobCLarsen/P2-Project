// Create a socket client and connect to the server
const mySocket = new WebSocket("wss://cs-25-sw-2-01.p2datsw.cs.aau.dk/ws1/");

mySocket.addEventListener("open", () => {
  // Send a message to identify this client as a dashboard
  mySocket.send(
    JSON.stringify({
      action: "connect",
      role: "dashboard", // Specify the role
    })
  );
});

// Get elements from the dom
const activeWorkersField = document.getElementById("active-workers");

mySocket.onmessage = (event) => {
  let message = JSON.parse(event.data);

  switch (message.action) {
    case "updateOnlineUsers":
      activeWorkersField.innerText = `Active Workers: ${message.users}`;
      break;

    default:
      console.warn("Unknown message type:", type);
  }
};
