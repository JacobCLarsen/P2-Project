let users = { User1: 0 };
function addPoints(user) {
  users[user] += 10; // Simulate computing contribution
  updateLeaderboard();
}
function updateLeaderboard() {
  let board = document.getElementById("leaderboard");
  board.innerHTML = "";
  for (let user in users) {
    board.innerHTML += `<div class='user'><span>${user}</span><span>${users[user]} Points</span></div>`;
  }
}
updateLeaderboard();
