import express from "express";
import { validateLogin } from "./auth.js";
import { signup } from "./signup.js";

export function setupAuth(app) {
  app.use(express.json()); // Enable JSON body parsing

  // Login API
  app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Missing username or password" });
    }

    const isValid = await validateLogin(username, password);

    if (isValid) {
      res.json({ success: true, message: "Login successful!" });
    } else {
      res
        .status(401)
        .json({ success: false, message: "Invalid username or password" });
    }
  });

  // Signup API
  app.post("/signup", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Missing username or password" });
    }

    const result = await signup(username, password);
    res.json(result);
  });

  console.log("Auth routes set up.");
}
