document.getElementById("signupForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const newUsername = document.getElementById("newUsername").value;
    const newPassword = document.getElementById("newPassword").value;
    const signupMessage = document.getElementById("signupMessage");

    try {
        const response = await fetch("/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: newUsername, password: newPassword }),
        });

        const data = await response.json();
        signupMessage.textContent = data.message;
        signupMessage.style.color = data.success ? "green" : "red";
    } catch (error) {
        signupMessage.textContent = "Error signing up!";
        signupMessage.style.color = "red";
    }
});
