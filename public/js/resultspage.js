const passowordList = document.getElementById("passwordList");
const reloadListBtn = document.getElementById("fetchResultsbtn");

// User_id for testing
const user_id = 2;

reloadListBtn.addEventListener("click", async () => {
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
      reloadResults(passwords);
    })
    .catch((error) => {
      console.error("Error fetching hashes", error);
    });
});

// Function to show results on the page
function reloadResults(passwords) {
  // Remove existing results on the page
  passowordList.innerHTML = "";
  // Create a list element for each password in the response
  passwords.forEach((password) => {
    const item = document.createElement("div");
    item.className = "passwordListItem";
    item.innerText = password;
    passowordList.append(item);
  });
}
