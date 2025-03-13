import fs from "fs/promises";
import path from "path";

const usersFilePath = path.join("users.txt");

// Function to sign up a new user
export async function signup(username, password) {
  try {
    // Check if the username already exists
    const data = await fs.readFile(usersFilePath, "utf8");
    const users = data.split("\n").map((line) => line.split(":")[0]);

    if (users.includes(username)) {
      return { success: false, message: "Username already taken!" };
    }

    // Append new user to the file
    await fs.appendFile(usersFilePath, `\n${username}:${password}`);
    return { success: true, message: "Account created successfully!" };
  } catch (error) {
    console.error("Error signing up user:", error);
    return { success: false, message: "Error creating account!" };
  }
}
