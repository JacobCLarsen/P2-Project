import fs from "fs";
import path from "path";

import { authenticateJWT } from "../middleware/middleware_jwt.js"; // Corrected path

/* ----- Store_results: (Store weak password in the database) ----- */
/**
 * Method: POST
 * URL: /store_results
 * Request Body: { weak_passwords: weakPasswords, task_id: taskID }
 */
export async function storeResults(app) {
  app.post("/store_results", async (req, res) => {
    const { weakPasswords, taskId, token } = req.body; // Extract weakPasswords and taskId from the request body

    if (!weakPasswords || !taskId || !token) {
      return res
        .status(400) // Respond with "Bad Request" if weakPasswords or taskId is missing
        .json({ success: false, message: "Missing results" });
    }
    const userId = await authenticateJWT(token);

    // Iterate over weakPasswords and insert each hash into the database
    weakPasswords.forEach((hash) => {
      const insertQuery =
        "INSERT INTO passwords (password_hash, taskId, userId) VALUES (?, ?, ?)";
      DBConnection.query(insertQuery, [hash, taskId, userId], (err, result) => {
        if (err) {
          console.error("❌ Error inserting password:", err); // Log error if query fails
          return res
            .status(500)
            .json({ success: false, message: "Internal server error" }); // Respond with "Internal Server Error"
        }
      });
    });

    // Respond with success after processing all weakPasswords
    res.json({ success: true, message: "Passwords logged successfully!" });
  });
}

// Filepath to text element
const filepath = path.join(process.cwd(), "./results.txt");

export async function storeResult(task) {
  // Pull the results from the task
  const results = task.results;

  // Convert the results array to a string (e.g., JSON or newline-separated)
  const resultsString = results.join("\n");

  // Writing the results to the text file
  try {
    fs.writeFileSync(filepath, resultsString, "utf-8");
    console.log("Results written successfully to results.txt");
  } catch (err) {
    console.error("Error writing results to file:", err);
  }
}

//TODO: have user_id as parameter
export async function storePasswordsOnDatabase(hashes) {
  // testing
  const user_id = 123;

  // Define data
  const postData = { weakPasswords: hashes, user_id: user_id };

  // Create a post request to store passwords
  try {
    const response = await fetch("store_passwords", {
      method: "POST", // Updating user data
      body: JSON.stringify(postData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Error ${response.status}`);
    }

    console.log("Inserted passwords into database", data);
    location.reload();
  } catch (error) {
    console.error("Error inserting passwords:", error);
    alert(`Error insterting passwords: ${error.message}`);
  }
}
