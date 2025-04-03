import fs from "fs";
import path from "path";

// Filepath to text element
const filepath = "./results.txt";

function storeResult(task) {
  // Pull the results from the task
  const results = task.results;

  // Writing the results to the text file
  try {
    fs.writeFileSync(filepath, results);
    // file written successfully
  } catch (err) {
    console.error(err);
  }
}

export { storeResult };
