// Hide the page initially
document.documentElement.style.display = "none";

// Function to redirect to login if authentication fails
function redirectToLogin() {
  const basePath = window.location.pathname.split("/").slice(0, 2).join("/");
  window.location.href = `${basePath}/login`;
}

// Wait for the DOM to load before running authentication
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");

  if (!token) {
    redirectToLogin();
    return;
  }

  // Create WebSocket connection for authentication
  const mySocket = new WebSocket("wss://cs-25-sw-2-01.p2datsw.cs.aau.dk/ws1/");

  authSocket.addEventListener("open", () => {
    authSocket.send(JSON.stringify({ action: "auth", token }));
  });

  authSocket.addEventListener("message", (event) => {
    const response = JSON.parse(event.data);

    if (response.action === "authenticated") {
      console.log("User authenticated:", response.user);
      document.documentElement.style.display = "block"; // Show the page
    } else if (response.action === "error") {
      console.error("Authentication failed:", response.message);
      redirectToLogin();
    }
  });

  authSocket.addEventListener("error", () => {
    console.error("WebSocket error");
    redirectToLogin();
  });

  authSocket.addEventListener("close", () => {
    console.warn("Authentication WebSocket closed");
    redirectToLogin();
  });
});
