import fs from "fs";
import path from "path";

// Filepath to text element
const filepath = path.join(process.cwd(), "./results.txt");

// Log the resolved file path for debugging
console.log("Resolved file path:", filepath);

function storeResult(task) {
  // Pull the results from the task
  const results = task.results;

  // Convert the results array to a string (e.g., JSON or newline-separated)
  const resultsString = results.join("\n");

  // Writing the results to the text file
  try {
    // Ensure the file exists or create it
    if (!fs.existsSync(filepath)) {
      fs.writeFileSync(filepath, "", "utf-8");
      console.log("Created results.txt as it did not exist.");
    }

    fs.writeFileSync(filepath, resultsString, "utf-8");
    console.log("Results written successfully to results.txt");
  } catch (err) {
    console.error("Error writing results to file:", err);
  }
}

export { storeResult };
