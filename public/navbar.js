document.addEventListener("DOMContentLoaded", function () {
  // Dynamically add the external CSS file for the navbar
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "css/navbar.css"; // Path to your external stylesheet
  document.head.appendChild(link);

  const navbarHTML = `
    <nav id="navbar">
    <div id="navbar-link-container">
        <a href="startwork" class="link">
            <button>Home</button>
        </a>
        <a href="dashboard" class="link">
            <button>Dashboard</button>
        </a>
        <a href="converter" class="link">
            <button>Converter</button>
        </a>
        <a href="about" class="link">
            <button>About</button>
        </a>
          </a>
        <a href="reward" class="link">
            <button>Reward</button>
        </a>
    </div>
    <div id="navbar-profile-container">
        <a href="profile" class="link">
            <button>Profile</button>
        </a>
        <div id="dropdown-content">
            <a id="log-out" href="login">
                Log out
            </a>
        </div>
    </div>
</nav>
    `;

  // Insert navbar at the top of the body
  document.body.insertAdjacentHTML("afterbegin", navbarHTML);

  // Add event listener to logout button
  document
    .getElementById("log-out")
    .addEventListener("click", function (event) {
      event.preventDefault(); // Prevent default link behavior

      // Remove token from localStorage
      localStorage.removeItem("token");

      // Redirect to login page
      window.location.href = "login";
    });
});
