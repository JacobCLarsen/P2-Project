// Fetch user data from the /user table in the database. Users are added to an array and sorted by number of points
async function fetchData() {
  try {
    const response = await fetch("get-leaderboard", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
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

// Display the leaderboard on the page, by changing the "board" element in the webpage to display users in order of most points
function loadLeaderboard(usersFromServer) {
  const board = document.getElementById("leaderboard");
  board.innerHTML = "";

  let user_ranking = 1;
  usersFromServer.forEach((user) => {
    // The top three users get a medal (gold, silver, and bronze) the "rankEmojis" array contains html entities for the medals
    const rankEmojis = ["&#129351", "&#129352", "&#129353"];
    const rankEmoji = rankEmojis[user_ranking - 1] || "";

    board.innerHTML += `
      <div class='user'>
      <span>${rankEmoji} ${user.username}</span>
      <span>${user.score} Points</span>
      </div>
    `;
    user_ranking++;
  });
}

// The leaderboard is updated and displayed on page load
window.addEventListener("load", () => {
  fetchData();
});
