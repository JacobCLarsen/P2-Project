import fs from "fs/promises";
import path from "path";

// Define the file path where user data is stored
const usersFilePath = path.join("users.json");

/**
 * Function to register a new user:
 * @param {string} username - The new user's chosen username
 * @param {string} password - The new user's chosen password
 * @returns {object} - An object indicating success or failure of signup
 */
export async function signup(username, password) {
  try {
    // Read the existing users from the JSON file
    let data = await fs.readFile(usersFilePath, "utf8");
    let usersData = {};

    // Parse the data if file is not empty, otherwise use an empty object
    if (data) {
      usersData = JSON.parse(data);
    }

    // Get the users object from usersData
    const users = usersData.users || {};

    // Check if the username is already taken
    const usernameExists = Object.values(users).some(
      (user) => user.username === username
    );
    if (usernameExists) {
      return { success: false, message: "Username already taken!" };
    }

    // Generate a new user ID (incremental based on existing users)
    const newUserId = Object.keys(users).length + 1;

    // Add the new user to the users object
    users[newUserId] = { username, password };

    // Update the usersData object with the new users object
    usersData.users = users;

    // Write the updated usersData object back to the JSON file
    await fs.writeFile(usersFilePath, JSON.stringify(usersData, null, 2));

    // Return success message
    return { success: true, message: "Account created successfully!" };
  } catch (error) {
    // Log an error if file reading or writing fails
    console.error("Error signing up user:", error);
    return { success: false, message: "Error creating account!" };
  }
}
