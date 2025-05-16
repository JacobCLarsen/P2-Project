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

// Function run when no weak passwords for a user
function shownoResults() {
  // Clear the list
  passowordList.innerHTML = "";
  // Add an item telling the user that they have no results
  const item = document.createElement("div");
  item.className = "noResultMessage";
  item.innerText = "No weak passwords";
  passowordList.append(item);
}

async function loadResults() {
  try {
    const user = await authenticateUser();
    user_id = user.userId;
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
        if (passwords.length > 0) {
          showResults(passwords);
        } else {
          shownoResults();
        }
      })
      .catch((error) => {
        console.error("Error fetching hashes", error);
      });
  } catch (error) {
    console.error("Error during authentication or fetching data:", error);
  }
}

// Return the user, authenticated using their local storage token
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

// Function to clear results
async function clearResults() {
  try {
    if (!user_id) {
      const user = await authenticateUser();
      user_id = user.userId;
    }
    await fetch(`passwordsDBDelete?user_id=${user_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete hashes");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Server response:", data);
        if (data.success) {
          passowordList.innerHTML = ""; // Clear the list on the page
          shownoResults(); // Show "No weak passwords" message
        }
      })
      .catch((error) => {
        console.error("Error deleting hashes", error);
      });
  } catch (error) {
    console.error("Error during authentication or deleting data:", error);
  }
}

export { loadResults, showResults, shownoResults, authenticateUser };
