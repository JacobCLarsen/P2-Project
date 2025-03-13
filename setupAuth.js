/* Imports: */
// - Import the Express framework for creating a web server 
// - Import the validateLogin function from auth.js to handle login validation
// - Import the signup function from signup.js to handle user registration
import express from "express";
import { validateLogin } from "./auth.js";
import { signup } from "./signup.js";

/**
 * Function to set up authentication-related routes in the Express app.
 * @param {object} app - The Express application instance
 */
export function setupAuth(app) {
  //Middleware to parse JSON data from incoming requests
  app.use(express.json()); //Enable JSON body parsing

  /* Login: (Handles user authentication) */
  /**
   * Method: POST
   * URL: /login
   * Request Body: { username: "example", password: "password123" }
   * Response: { success: true/false, message: "Login successful!" / "Invalid username or password" }
   */
  app.post("/login", async (req, res) => {
    //Extract username and password from the request body
    const { username, password } = req.body;

     //Check if both username and password are provided
    if (!username || !password) {
      return res
        .status(400) //Bad request status response code
        .json({ success: false, message: "Missing username or password" }); //Error message if username or password is missing
    }

    //Validate login credentials
    const isValid = await validateLogin(username, password);

    if (isValid) {
      //Send success response if credentials are valid
      res.json({ success: true, message: "Login successful!" });
    } else {
      //Send error response if credentials are invalid
      res
        .status(401) //Unauthorized status response code
        .json({ success: false, message: "Invalid username or password" }); //Error message if username or password is wrong
    }
  });


  /* Signup: (Handles new user registration) */
  /**
   * Method: POST
   * URL: /signup
   * Request Body: { username: "newUser", password: "securePassword" }
   * Response: { success: true/false, message: "User registered successfully" / "Username already exists" }
   */
  app.post("/signup", async (req, res) => {
    //Extract username and password from the request body
    const { username, password } = req.body;

    //Check if both username and password are provided
    if (!username || !password) {
      return res
        .status(400) //Bad request status response code
        .json({ success: false, message: "Missing username or password" }); //Error message if username or password is missing
    }

    //Call the signup function to create a new user
    const result = await signup(username, password);

    //Send the response returned from the signup function
    res.json(result);
  });

  //Log message to indicate that authentication routes have been set up
  console.log("Auth routes set up.");
}
