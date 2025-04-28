// Import Libraries / Functions
import { Router } from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { authenticateJWT } from "../middleware/middleware_jwt.js";

// Import function from other files
import { createTask } from "../tasks/createTask.js";
import { startNewTask } from "../tasks/startNewtask.js";

// Add a socket connection to the router page
const mySocket = new WebSocket("wss://cs-25-sw-2-01.p2datsw.cs.aau.dk/ws3/");

const router = Router();

// Convert import.meta.url to a file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); // Get the current file directory

// Adjust the basePath to correctly point to the public/html folder from the root directory
const basePath = path.join(__dirname, "../../public/html"); // Going up one level to the root, then to 'public/html'

// Define a route for the home page
router.get("/", (req, res) => {
  res.sendFile(path.join(basePath, "login.html")); // Serve the login page
});

// Route for the login page
router.get("/login", (req, res) => {
  res.sendFile(path.join(basePath, "login.html")); // Serve the login page
});

// Route for the worker page
router.get("/startwork", (req, res) => {
  res.sendFile(path.join(basePath, "workerpage.html")); // Serve the worker page
});

// Route for the profile page
router.get("/profile", (req, res) => {
  res.sendFile(path.join(basePath, "profile.html")); // Serve the profile page
});

// Route for the signup page
router.get("/signup", (req, res) => {
  res.sendFile(path.join(basePath, "signup.html")); // Serve the signup page
});

// Route for the dashboard page
router.get("/dashboard", (req, res) => {
  res.sendFile(path.join(basePath, "dashboard.html")); // Serve the dashboard page
});

// Route for the converter page
router.get("/converter", (req, res) => {
  res.sendFile(path.join(basePath, "converter.html")); // Serve the converter page
});

// Route for the leaderboard page
router.get("/leaderboard", (req, res) => {
  res.sendFile(path.join(basePath, "reward.html")); // Serve the leaderboard page
});

// Route for the client/user results page
router.get("/results", (req, res) => {
  res.sendFile(path.join(basePath, "results.html")); // Serve the results page
});

// Route for the Terms & Conditions page
router.get("/t&c", (req, res) => {
  res.sendFile(path.join(basePath, "t&c.html")); // Serve the Terms & Conditions page
});

// Route for the Privacy Policy page
router.get("/privacypolicy", (req, res) => {
  res.sendFile(path.join(basePath, "privacy-policy.html")); // Serve the Privacy Policy page
});

// -------------- Post requests --------------

// Handle the post request to upload hashes as a user. Data has been validated on the client side
router.post("/startwork", (req, res) => {
  console.log("Request file:", req.body.hashes); // Log the received hashes

  const hashes = req.body.hashes;

  // Check if hashes are provided
  if (!hashes) {
    return res.status(400).json({ error: "No file uploaded" }); // Return error if no hashes are provided
  }

  // Check if the hashes array is empty
  if (hashes.length === 0) {
    return res.status(400).json({ error: "No valid hashes found in the file" }); // Return error if no valid hashes are found
  }

  // Respond with success and the number of received hashes
  res.json({ success: true, received: hashes.length, hashes });

  // Create a task with the received hashes
  const newTask = createTask(hashes);

  // Add the task to the queue
  startNewTask(newTask);

  // Sending the task to the WebSocket server
  const message = {
    action: "add client task", // Action to add a new client task
    task: newTask, // Task details
  };
  mySocket.send(JSON.stringify(message)); // Send the message to the WebSocket server
});

// Export the router to be used in other parts of the application
export default router;
