document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const basePath = path.join(__dirname, "./public/html"); // Going up one level to the root, then to 'public/html'

  if (!token) {
    // Redirect to login if no token is found
    window.location.href = `${basePath}/login`;
  }
});
