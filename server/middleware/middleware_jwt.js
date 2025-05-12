// Import the jsonwebtoken library for handling JWT operations
import jwt from "jsonwebtoken";

// Function to authenticate a JWT token
export const authenticateJWT = (token) => {
  return new Promise((resolve, reject) => {
    // Check if the token is provided
    if (!token) {
      return reject(new Error("No token provided")); // Reject if no token is provided
    }

    console.log(token); // Log the token for debugging purposes

    // Verify the token using the secret key
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return reject(new Error("Invalid or expired token.")); // Reject if the token is invalid or expired
      }

      resolve(decoded); // Resolve with the decoded token if authentication is successful
    });
  });
};
