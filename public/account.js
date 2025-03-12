async function handleRegister(e) {
    e.preventDefault(); //Prevent form from submitting

    const newUsername = document.getElementById("newUsername").value;
    const newPassword = document.getElementById("newPassword").value;

    const response = await fetch("/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: newUsername, password: newPassword }),
    });

    const result = await response.json();
    if (result.success) {
      alert("Account created successfully!");
      window.location.href = "login.html"; //Redirect to login page
    } else {
      alert(result.message); //Display error message
    }
  }