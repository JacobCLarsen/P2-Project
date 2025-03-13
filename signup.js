/* Imports: */
// - Import the file system module with promise-based functions
// - Import the path module for handling file paths
import fs from "fs/promises";
import path from "path";

//Define the file path where user data is stored
const usersFilePath = path.join("users.txt");

/**
 * Function to register a new user:
 * @param {string} username - The new user's chosen username
 * @param {string} password - The new user's chosen password
 * @returns {object} - An object indicating success or failure of signup
 */
export async function signup(username, password) {
  try {
    //Read the existing users from the file
    const data = await fs.readFile(usersFilePath, "utf8");

    //Extract existing usernames from the file
    const users = data.split("\n").map((line) => line.split(":")[0]);

    //Check if the username is already taken
    if (users.includes(username)) {
      return { success: false, message: "Username already taken!" };
    }

    //Append the new user credentials to the file
    await fs.appendFile(usersFilePath, `\n${username}:${password}`);

    //Return message:
    return { success: true, message: "Account created successfully!" };

  } catch (error) {
    //Log an error if file reading or writing fails
    console.error("Error signing up user:", error);
    return { success: false, message: "Error creating account!" };
  }
}
