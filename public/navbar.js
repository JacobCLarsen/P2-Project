document.addEventListener("DOMContentLoaded", function () {
  // Dynamically add the external CSS file for the navbar
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "/css/navbar.css"; // Path to your external stylesheet
  document.head.appendChild(link);

  const navbarHTML = `
    <nav id="navbar">
        <div id="navbar-link-container">
        <a href="/startwork">
            <button>Home</button>
        </a>
        <a href="/about">
            <button>About</button>
        </a>
        <a href="/profile">
            <button>Profile</button>
        </a>
        <a href="/converter">
            <button>Converter</button>
        </a>
        <a href="/dashboard">
            <button>Dashboard</button>
        </a>
        </div>
        <div id="navbar-logout-container">
        <a href="/login">
            <button>Log out</button>
        </a>
        </div>
    </nav>
    `;

  // Insert navbar at the top of the body
  document.body.insertAdjacentHTML("afterbegin", navbarHTML);
});
