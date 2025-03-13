//Select the signup form and add an event listener for form submission
document
  .getElementById("signupForm") //Gets the signup form element via its given id
  .addEventListener(
    "submit", //Add eventlistener to check when user submits their account information
    async function (event) {
      event.preventDefault(); //Prevent default form submission behavior (avoids page reload)

      //Get user input values
      const newUsername = document.getElementById("newUsername").value; //Entered username for account creation
      const newPassword = document.getElementById("newPassword").value; //Entered password for account creation
      const message = document.getElementById("message"); //Declaring signup meesage for later account creation response

      try {
        //Send a POST request to the server to create a new user
        const response = await fetch("/signup", {
          method: "POST", //HTTP method
          headers: { "Content-Type": "application/json" }, //Specify JSON format
          body: JSON.stringify({
            username: newUsername,
            password: newPassword,
          }), //Convert input data to JSON format
        });

        //Awaits response from server before moving on:
        const data = await response.json();

        if (data.success) {
          //If signup is successful, display success message
          message.style.color = "green";
          message.textContent = "Sign Up Successful!";

          //Redirect user to the login page after a short delay
          setTimeout(() => {
            window.location.href = "/login"; //Redirect to login page after success
          }, 500);
        } else {
          //If signup fails, throw an error with the server-provided message
          throw new Error(data.message);
        }
      } catch (error) {
        //Handle any errors that occur during the signup process
        message.style.color = "red";
        message.textContent = error.message || "Error signing up!";
      }
    }
  );
