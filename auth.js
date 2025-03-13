import fs from "fs/promises";
import path from "path";

// Path to the users.txt file
const usersFilePath = path.join("users.txt");

// Function to validate login credentials
export async function validateLogin(username, password) {
  try {
    // Read the file
    const data = await fs.readFile(usersFilePath, "utf8");

    console.log("Users file content:", data); // Debugging line

    // Convert file data into an array of users
    const users = data.split("\n").map((line) => {
      const [storedUsername, storedPassword] = line
        .split(":")
        .map((value) => value.trim());
      return { username: storedUsername, password: storedPassword };
    });

    console.log("Parsed Users:", users); // Debugging line

    // Check if the provided credentials match any user in the database
    return users.some(
      (user) => user.username === username && user.password === password
    );
  } catch (error) {
    console.error("Error reading users file:", error);
    return false; // If there's an error, deny login
  }
}
