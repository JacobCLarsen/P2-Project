import { Router } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { authenticateJWT } from "./middleware_jwt.js";

// Import function from other files
import { createTask } from "./createTask.js";
import { rsaUtils } from "./public/rsaUtilsBrowser.js";
// Add a socket connection to the router page
const mySocket = new WebSocket("wss://cs-25-sw-2-01.p2datsw.cs.aau.dk/ws2/");

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

// Route for the leaderboard page
router.get("/leaderboard", (req, res) => {
  res.sendFile(path.join(basePath, "reward.html"));
});

// Route for the client/ user my weak passwords page
router.get("/results", (req, res) => {
  res.sendFile(path.join(basePath, "results.html"));
});

// -------------- Post requests --------------

// Handle the post request to upload hashes as a user. Data has been validated on the client side

router.post("/startwork", (req, res) => {
  console.log("Request file:", req.body.hashes);

  const hashes = req.body.hashes;
  const publicKey = importPublicKey(req.body.publicKey);

  if (!hashes) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  if (!publicKey) {
    return res.status(400).json({ error: "No key given in request" });
  }

  if (hashes.length === 0) {
    return res.status(400).json({ error: "No valid hashes found in the file" });
  }
  res.json({ success: true, received: hashes.length, hashes });

  // Create a task with the reveiced hashes
  const newTask = createTask(hashes, publicKey);
  console.log("sending task to the server socket", newTask);

  // add task to the queue
  //startNewTask(newTask);

  // Sending the task to the websocket server socket
  const message = {
    action: "add client task",
    task: newTask,
  };
  mySocket.send(JSON.stringify(message));

  // TODO: Send the message to the server using websockets
});

export default router;
