const users = [
  { username: "Daniel", password: "123" },
  { username: "Jacob", password: "345" },
  { username: "Philip", password: "567" },
  { username: "Anders", password: "789" },
  { username: "Zet", password: "1234" },
];

function validateLogin(event) {
  event.preventDefault(); // Prevent the browser's default form submission

  const enteredUsername = document.getElementById("username").value;
  const enteredPassword = document.getElementById("password").value;
  const message = document.getElementById("message");

  // Clear the error message each time user tries to submit
  message.textContent = "";

  // Find the user with matching credentials
  const CorrectUser = users.find(
    (user) =>
      user.username === enteredUsername && user.password === enteredPassword
  );

  // Show success or error message
  if (CorrectUser) {
    message.style.color = "green";
    message.textContent = "Login Successful!";

    // Redirect to the homepage (root route)
    setTimeout(() => {
      // Timeout for dramatic effect
      window.location.href = "/startwork"; // Redirect to the homepage
    }, 500);
  } else {
    message.style.color = "red";
    message.textContent = "Invalid Username or Password! Please try again.";

    // Focus the username or password field to guide the user
    document.getElementById("username").focus();
  }
}
