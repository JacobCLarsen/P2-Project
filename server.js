/* Imports:
 * Express for API's/ routing
 * Socket.io (Websockets) are used for real time communication between the clients and the server
 * "require "./router"" specifies wherer to find the routes for the webpages
 */
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import router from "./router.js";
import { setupSocketCommunication } from "./setupSocketCommunication.js";
import { setupAuth } from "./setupAuth.js";
import path from "path";
import { fileURLToPath } from "url";
import { createProxyServer } from "http-proxy";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express App & Server:
const app = express();
const server = createServer(app);

// Create socket.io Server:
const io = new Server(server, {
  cors: {
    origin: "*", // Adjust this to your proxy's origin if needed
    methods: ["GET", "POST"],
  },
  allowEIO3: true, // Enable compatibility with older Socket.IO clients if required
});

// Add middleware to set proxy response headers
io.engine.on("headers", (headers, req) => {
  headers["X-Custom-Header"] = "CustomValue"; // Replace with your proxy's required headers
  // Add other headers as needed
});

// Use the router for handling routes:
app.use("/", router);

// Define the path of public content:
app.use(express.static(path.join(__dirname, "public")));

// Set up Socket Communication:
setupSocketCommunication(io);

// Set up Authentication Routes:
setupAuth(app); // Calls the function to add login/signup routes

const proxy = createProxyServer({ ws: true }); // Enable WebSocket proxying

// Proxy WebSocket connections
app.use("/ws0", (req, res) =>
  proxy.web(req, res, { target: "ws://localhost:4310" })
);
app.use("/ws1", (req, res) =>
  proxy.web(req, res, { target: "ws://localhost:4311" })
);
app.use("/ws2", (req, res) =>
  proxy.web(req, res, { target: "ws://localhost:4312" })
);
app.use("/ws3", (req, res) =>
  proxy.web(req, res, { target: "ws://localhost:4313" })
);
app.use("/ws4", (req, res) =>
  proxy.web(req, res, { target: "ws://localhost:4314" })
);
app.use("/ws5", (req, res) =>
  proxy.web(req, res, { target: "ws://localhost:4315" })
);
app.use("/ws6", (req, res) =>
  proxy.web(req, res, { target: "ws://localhost:4316" })
);
app.use("/ws7", (req, res) =>
  proxy.web(req, res, { target: "ws://localhost:4317" })
);
app.use("/ws8", (req, res) =>
  proxy.web(req, res, { target: "ws://localhost:4318" })
);
app.use("/ws9", (req, res) =>
  proxy.web(req, res, { target: "ws://localhost:4319" })
);

// Proxy HTTP connections
app.use("/node0", (req, res) =>
  proxy.web(req, res, { target: "http://localhost:3310" })
);
app.use("/node1", (req, res) =>
  proxy.web(req, res, { target: "http://localhost:3311" })
);
app.use("/node2", (req, res) =>
  proxy.web(req, res, { target: "http://localhost:3312" })
);
app.use("/node3", (req, res) =>
  proxy.web(req, res, { target: "http://localhost:3313" })
);
app.use("/node4", (req, res) =>
  proxy.web(req, res, { target: "http://localhost:3314" })
);
app.use("/node5", (req, res) =>
  proxy.web(req, res, { target: "http://localhost:3315" })
);
app.use("/node6", (req, res) =>
  proxy.web(req, res, { target: "http://localhost:3316" })
);
app.use("/node7", (req, res) =>
  proxy.web(req, res, { target: "http://localhost:3317" })
);
app.use("/node8", (req, res) =>
  proxy.web(req, res, { target: "http://localhost:3318" })
);
app.use("/node9", (req, res) =>
  proxy.web(req, res, { target: "http://localhost:3319" })
);

// Handle WebSocket upgrades
server.on("upgrade", (req, socket, head) => {
  const target = req.url.startsWith("/ws0")
    ? "ws://localhost:4310"
    : req.url.startsWith("/ws1")
    ? "ws://localhost:4311"
    : req.url.startsWith("/ws2")
    ? "ws://localhost:4312"
    : req.url.startsWith("/ws3")
    ? "ws://localhost:4313"
    : req.url.startsWith("/ws4")
    ? "ws://localhost:4314"
    : req.url.startsWith("/ws5")
    ? "ws://localhost:4315"
    : req.url.startsWith("/ws6")
    ? "ws://localhost:4316"
    : req.url.startsWith("/ws7")
    ? "ws://localhost:4317"
    : req.url.startsWith("/ws8")
    ? "ws://localhost:4318"
    : req.url.startsWith("/ws9")
    ? "ws://localhost:4319"
    : null;

  if (target) {
    proxy.ws(req, socket, head, { target });
  } else {
    socket.destroy(); // Close the connection if no matching target is found
  }
});

// Port for the Server:
server.listen(3310, "0.0.0.0", () => {
  console.log("listening on http://localhost:3310");
});
