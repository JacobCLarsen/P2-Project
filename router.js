import { Router } from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { authenticateJWT } from "./middleware_jwt.js";
import multer from "multer"; // Import multer for file uploads

const router = Router();

// Convert import.meta.url to a file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); // Get the current file directory

// Adjust the basePath to correctly point to the public/html folder from the root directory
const basePath = path.join(__dirname, "./public/html"); // Going up one level to the root, then to 'public/html'

// Configure multer for file uploads
const upload = multer({ dest: "uploads/" }); // Files will be stored in the "uploads" directory

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
<<<<<<< HEAD
router.post("startwork", upload.single("file"), (req, res) => {
=======
router.post("/startwork", (req, res) => {
>>>>>>> parent of 0fb1192 (test)
  console.log("Request file:", req.file); // Debug log to inspect the uploaded file

  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  // Read the file content and process it into an array of hashes
  const fileContent = fs.readFileSync(req.file.path, "utf-8");
  const hashes = fileContent
    .split("\n")
    .map((line) => line.trim())
    .filter((hash) => hash.length === 128); // Ensure only valid 512-bit hashes are included

  console.log("Extracted hashes:", hashes);

  if (hashes.length === 0) {
    return res.status(400).json({ error: "No valid hashes found in the file" });
  }

  // TODO: Connect to the websockets server, create a new task and send it to the websocket server client to add it to the queue

  //res.json({ success: true, received: hashes.length, hashes });
  res.end();
});

export default router;
