document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");

  if (!token) {
    // Redirect to login if no token is found
    window.location.href = "/login.html";
  }
});
