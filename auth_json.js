/* Imports: */
// - Import the 'fs/promises' module to work with the file system asynchronously (read/write operations)
// - Import the 'path' module to handle file paths in a cross-platform manner
import fs from "fs/promises";
import path from "path";

// Define the path to the users.json file, which stores user credentials
const usersFilePath = path.join("users.json");

// Function to validate login credentials
export async function validateLogin(username, password) {
  try {
    // Read the contents of the users.json file
    const data = await fs.readFile(usersFilePath, "utf8");

    // Parse the file data (which is in JSON format)
    const usersData = JSON.parse(data); // Parse the JSON data

    // Check if the users object exists and has the 'users' property
    const users = usersData.users || {};

    // Check if the provided credentials match any user in the database
    const user = Object.values(users).find(
      (user) => user.username === username && user.password === password
    );

    // Return true if a user is found with matching username and password, otherwise false
    return user ? true : false;
  } catch (error) {
    // Handle any errors that occur while reading or parsing the file
    console.error("Error reading users file:", error);
    return false; // Return false to indicate login failure
  }
}
