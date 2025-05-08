// Import socket from requireAuth
import { socket } from "./requireAuth.js";

// Document elements
const passowordList = document.getElementById("passwordList");
const reloadListBtn = document.getElementById("fetchResultsbtn");

// Authenticate the user, to make sure the user is logged in
let user_id;

// Load results on page load and when the reload button is clicked
window.addEventListener("load", async () => {
  loadResults()
});

reloadListBtn.addEventListener("click", async () => {
  loadResults()
});

// Function to show results on the page
function showResults(passwords) {
  // Remove existing results on the page
  passowordList.innerHTML = "";
  // Create a list element for each password in the response
  passwords.forEach((password) => {
    const item = document.createElement("div");
    item.className = "passwordListItem";
    item.innerText = password;
    passowordList.append(item);
  });
  console.log("Results updated on page");
  
}

async function loadResults(){
    try {
        const user = await authenticateUser();
        user_id = user.userId; // Set the user_id after successful authentication
        await fetch(`passwordsDB?user_id=${user_id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Failed to fetch hashes");
            }
            return response.json();
          })
          .then((data) => {
            console.log("Server response:", data);
            const passwords = data.passwords.map((row) => row.password);
            showResults(passwords);
          })
          .catch((error) => {
            console.error("Error fetching hashes", error);
          });
      } catch (error) {
        console.error("Error during authentication or fetching data:", error);
      }
}

async function authenticateUser() {
  const token = localStorage.getItem("token");

  if (!token) {
    console.log("No token found, redirecting to login.");
    redirectToLogin();
    return Promise.reject(new Error("No token found"));
  }

  // Ensure socket is open before sending anything
  if (socket.readyState !== WebSocket.OPEN) {
    await new Promise((resolve, reject) => {
      socket.addEventListener("open", resolve);
      socket.addEventListener("error", reject);
    });
  }

  return new Promise((resolve, reject) => {
    socket.send(JSON.stringify({ action: "authenticate", token }));

    function handleMessage(event) {
      const response = JSON.parse(event.data);

      if (response.action === "authenticated") {
        console.log("User authenticated:", response.user);
        document.documentElement.style.display = "block"; // Show the page after successful authentication
        socket.removeEventListener("message", handleMessage);
        resolve(response.user);
      } else if (response.action === "error") {
        console.error("Error:", response.message);
        socket.removeEventListener("message", handleMessage);
        if (response.message === "Invalid token") {
          redirectToLogin();
        }
        reject(new Error("Authentication error: " + response.message));
      }
    }

    socket.addEventListener("message", handleMessage);
  });
}
