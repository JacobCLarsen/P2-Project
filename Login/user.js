
// we make a struct with the login info both (username and password)
  const users = [
    {username: "Daniel" , password:"123"},
    {username: "Jacob" , password:"345"},
    {username: "Philip" , password:"567"},
    {username: "Anders" , password:"789"},
    {username: "Zet" , password:"1234"} 
  ];  

  function validateLogin(event) {
            event.preventDefault(); // Prevent form from submitting

            // here is the main part. it reads the entered username and password 
            const enteredUsername = document.getElementById("username").value;
            const enteredPassword = document.getElementById("password").value;
            const message = document.getElementById("message");

            // here we try to find whether the given Username and password matches with the entered username and password
  const CorrectUser = users.find (user => user.username === enteredUsername && user.password === enteredPassword);

            if (CorrectUser)
            {
                message.style.color = "green";
                message.textContent = "Login Successful!";
                alert("Welcome, " + enteredUsername + "!");
                window.location.href = "welcome.html"; // Redirect (Optional)
            } 
            
            // if the given login is not in the user folder we get a message "Invalid Username or password" in red
            else {
                message.style.color = "red";
                message.textContent = "Invalid Username or Password!";
            }
        }