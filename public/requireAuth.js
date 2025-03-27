const socket = new WebSocket("wss://cs-25-sw-2-01.p2datsw.cs.aau.dk/ws1/");

socket.addEventListener("open", () => {
  console.log("WebSocket connected");

  // Authenticate immediately if token exists
  const token = localStorage.getItem("token");
  if (token) {
    socket.send(JSON.stringify({ action: "authenticate", token }));
  }
});

socket.addEventListener("message", (event) => {
  const response = JSON.parse(event.data);

  if (response.action === "authenticated") {
    console.log("User authenticated:", response.user);
    document.documentElement.style.display = "block"; // Show page
  } else if (response.action === "error") {
    console.error("Error:", response.message);
    if (response.message === "Invalid token") {
      window.location.href = "/login";
    }
  }
});

// Function to send messages
function sendMessage(data) {
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(data));
  } else {
    console.warn("WebSocket not open yet");
  }
}

export { socket, sendMessage };
