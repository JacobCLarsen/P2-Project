async function validateLogin(e) {
  event.preventDefault(); // Prevent the browser's default form submission

  const enteredUsername = document.getElementById("username").value;
  const enteredPassword = document.getElementById("password").value;
  const message = document.getElementById("message");

  message.textContent = ""; // Clear error messages

  try {
    const response = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: enteredUsername,
        password: enteredPassword,
      }),
    });

    const data = await response.json();

    if (data.success) {
      message.style.color = "green";
      message.textContent = "Login Successful!";
      setTimeout(() => {
        window.location.href = "/startwork"; // Redirect after success
      }, 500);
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    message.style.color = "red";
    message.textContent = error.message || "Invalid login!";
  }
}


