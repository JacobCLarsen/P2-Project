import DBConnection from "./databaseConnection.js";

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
