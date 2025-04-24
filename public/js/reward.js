let users = {
  User1: 0,
  User2: 0,
  User3: 0,
  User4: 0,
  User5: 0,
  User6: 0,
};
function addPoints(user) {
  users[user] += 20; // Simulate computing contribution
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
