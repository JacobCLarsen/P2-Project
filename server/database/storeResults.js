import DBConnection from "./databaseConnection.js";

/* ----- Store_results: (Store weak password in the database) ----- */
/**
 * Method: POST
 * URL: /store_results
 * Request Body: { weak_passwords: weakPasswords, task_id: taskID }
 */

// API endopoint for adding points
export async function addPoints(points, userId) {
  app.post("/add-points", async (req, res) => {
    try {
      // Update user score in the database
      console.log("Points: " + points);
      console.log("Id: " + userId);
      const query = "UPDATE users SET score = score + ?, WHERE id = ?";
      DBConnection.query(query, [points, userId], (err, result) => {
        if (err) {
          console.error("Database update error:", err);
          return res
            .status(500)
            .json({ success: false, message: "Database update failed" });
        }

        if (result.affectedRows === 0) {
          return res
            .status(404)
            .json({ success: false, message: "User not found" });
        }

        res.json({ success: true, message: "Points added successfully" });
      });
    } catch (error) {
      console.error("Points update error:", error);
      res.status(401).json({ success: false, message: error.message });
    }
  });
}

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

export async function storePasswordsOnDatabase(task) {
  // Parse weakpasswords from task.results
  let weakPasswords;
  if (typeof task.results === "string") {
    weakPasswords = task.results.split(",").map((p) => p.trim());
  } else {
    weakPasswords = task.results; // Already an array
  }

  try {
    // Extract data from body
    if (!Array.isArray(weakPasswords) || !task.user_id) {
      return res.status(400).json({
        success: false,
        message: "Invalid request: missing passwords or user ID",
      });
    }

    // SQL query
    const query = "INSERT INTO passwords (password, user_id) VALUES (?, ?)";

    // Wrap inserts in promises for async handling
    weakPasswords.forEach((password) => {
      DBConnection.query(query, [password, task.user_id], (err, result) => {
        if (err) {
          console.error("Error inserting password:", err);
        } else {
          console.log("Password inserted successfully:", result);
        }
      });
    });
  } catch (error) {
    console.error("Error storing passwords:", error);
  }
}
