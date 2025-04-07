const socket = new WebSocket("wss://cs-25-sw-2-01.p2datsw.cs.aau.dk/ws1/");
document.documentElement.style.display = "none"; // Hide the page intitially

// Function to redirect to login if authentication fails
function redirectToLogin() {
  const basePath = window.location.pathname.split("/").slice(0, 2).join("/");
  window.location.href = `${basePath}/login`;
}

socket.addEventListener("open", () => {
  console.log("WebSocket connected");

  // Authenticate immediately if token exists
  const token = localStorage.getItem("token");
  if (token) {
    socket.send(JSON.stringify({ action: "authenticate", token }));
  } else {
    console.log("No token found, redirecting to login.");
    redirectToLogin();
  }
});

socket.addEventListener("message", (event) => {
  const response = JSON.parse(event.data);

  if (response.action === "authenticated") {
    console.log("User authenticated:", response.user);
    document.documentElement.style.display = "block"; // Show the page after successful authentication
  } else if (response.action === "error") {
    console.error("Error:", response.message);
    if (response.message === "Invalid token") {
      // If the token is invalid, redirect to login
      redirectToLogin();
    } else {
      // Handle other errors as needed
      alert("Authentication error: " + response.message);
    }
  }
});

// Handle WebSocket errors
socket.addEventListener("error", (event) => {
  console.error("WebSocket error:", event);
  alert("WebSocket error. Please try again later.");
  redirectToLogin();
});

export { socket };
