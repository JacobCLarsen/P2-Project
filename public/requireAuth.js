// Hide the page initially
document.documentElement.style.display = "none";

// Check for authentication token
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");

  if (!token) {
    // Extract base path dynamically
    const basePath = window.location.pathname.split("/").slice(0, 2).join("/");

    // Redirect to login page with dynamic base path
    window.location.href = `${basePath}/login`;
  } else {
    document.documentElement.style.display = "block"; // Show the page if authenticated
  }
});
