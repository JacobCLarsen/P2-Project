async function fetchData() {
  try {
    const response = await fetch("leaderboard", {
      method: "GET",
    });

    console.log("Response status:", response.status); // Debug log

    const data = await response.json();
    console.log("Response data:", data); // Debug log

    if (!response.ok) {
      throw new Error(
        data.message || `Request failed with status: ${response.status}`
      );
    }

    if (data.success) {
      console.log("Leaderboard loaded successfully:", data.user);
      loadLeaderboard(data.user);
    } else {
      throw new Error(data.message || "Failed to load leaderboard data");
    }
  } catch (error) {
    console.error("Error loading leaderboard:", error);
    alert(`Error loading leaderboard: ${error.message}`);
  }
}

function loadLeaderboard(usersFromServer) {
  const board = document.getElementById("leaderboard");
  board.innerHTML = "";

  usersFromServer.forEach((user) => {
    board.innerHTML += `
      <div class='user'>
        <span>${user.username}</span>
        <span>${user.score} Points</span>
      </div>
    `;
  });
}

fetchData();
