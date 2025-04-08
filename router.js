import { Router } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { authenticateJWT } from "./middleware_jwt.js";

const router = Router();

// Convert import.meta.url to a file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); // Get the current file directory

// Adjust the basePath to correctly point to the public/html folder from the root directory
const basePath = path.join(__dirname, "./public/html"); // Going up one level to the root, then to 'public/html'

// Define a route for the home page
router.get("/", (req, res) => {
  res.sendFile(path.join(basePath, "login.html"));
});

// Route for the login page
router.get("/login", (req, res) => {
  res.sendFile(path.join(basePath, "login.html"));
});

// Route for the worker page
router.get("/startwork", (req, res) => {
  res.sendFile(path.join(basePath, "workerpage.html"));
});

// Route for the about page
router.get("/about", (req, res) => {
  res.sendFile(path.join(basePath, "about.html"));
});

// Route for the profile page
router.get("/profile", (req, res) => {
  res.sendFile(path.join(basePath, "profile.html"));
});

// Route for the signup page
router.get("/signup", (req, res) => {
  res.sendFile(path.join(basePath, "signup.html"));
});

// Route for the dashboard page
router.get("/dashboard", (req, res) => {
  res.sendFile(path.join(basePath, "dashboard.html"));
});

// Route for the converter page
router.get("/converter", (req, res) => {
  res.sendFile(path.join(basePath, "converter.html"));
});

// -------------- Post requests --------------

// Handle the post request to upload hashes as a user. Data has been validated on the client side
router.post("/startwork", (req, res) => {
  console.log("Request body:", req.body); // Debug log to inspect the request body

  const hashes = req.body.hashes;

  if (!Array.isArray(hashes)) {
    console.error("Invalid data format: hashes is not an array");
    return res.status(400).json({ error: "Invalid data format" });
  }

  console.log("Received hashes:", hashes);
  res.json({ success: true, received: hashes.length });
});

export default router;
