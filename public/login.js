//Function to handle login form submission
async function validateLogin(e) {
  e.preventDefault(); //Prevent the browser's default form submission

  //Get user input values
  const enteredUsername = document.getElementById("username").value; //Entered username for account creation
  const enteredPassword = document.getElementById("password").value; //Entered password for account creation
  const message = document.getElementById("message"); //Element to display login messages

  message.textContent = ""; //Clear any previous error or success messages

  try {
    //Send a POST request to the server with login credentials
    const response = await fetch("/login", {
      method: "POST", //HTTP method
      headers: { "Content-Type": "application/json" }, //Specify JSON format
      body: JSON.stringify({
        username: enteredUsername,
        password: enteredPassword,
      }), //Convert user input into a JSON string
    });

    //Awaits response from server before moving on:
    const data = await response.json();

    if (data.success) {
      //If login is successful, display success message
      message.style.color = "green";
      message.textContent = "Login Successful!";

      //Redirect user to the start work page after a short delay
      setTimeout(() => {
        window.location.href = "/startwork"; //Redirect to work page after success
      }, 500);
    } else {
      //If login fails, throw an error with the server-provided message
      throw new Error(data.message);
    }
  } catch (error) {
    //Handle errors by displaying the error message in red
    message.style.color = "red";
    message.textContent = error.message || "Invalid login!";
  }
}
