/* Imports: */
// - Import the 'fs/promises' module to work with the file system asynchronously (read/write operations)
// - Import the 'path' module to handle file paths in a cross-platform manner
import fs from "fs/promises";
import path from "path";

//Define the path to the users.txt file, which stores user credentials
const usersFilePath = path.join("users.txt");

//Function to validate login credentials
export async function validateLogin(username, password) {
  try {
    //Read the contents of the users.txt file
    const data = await fs.readFile(usersFilePath, "utf8");

    //Convert the file data (string) into an array of user objects
    const users = data.split("\n").map((line) => {
    // - .split("\n") splits the file content into an array of lines (each line represents a user)
    // - .map() iterates over each line and transforms it into an object containing username and password

      const [storedUsername, storedPassword] = line
        .split(":")                    // - .split() each line at ":" to separate username and password
        .map((value) => value.trim()); // - .map() iterates over the split values and .trim() removes whitespace
      return { username: storedUsername, password: storedPassword }; //Returns/stores an object for each user
    });

    //Check if the provided credentials match any user in the database
    return users.some(
      (user) => user.username === username && user.password === password
    );
    // - .some() checks if at least one element in the 'users' array matches the given username and password.
    //   If a match is found, it returns true (successful login); otherwise, it returns false.

  } catch (error) {
    //Handle any errors that occur while reading the file
    console.error("Error reading users file:", error);
    return false; //Return false to indicate login failure
  }
}
