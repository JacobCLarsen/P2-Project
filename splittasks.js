import fs from "fs";
import path from "path";

// Path to the dictionary file
const dictionaryPath = path.join(process.cwd(), "dictionary.txt");

// Number of active workers
const activeWorkers = 4;

// Function to split the list into equal batches
function splitTasks(filePath, workers) {
  // Read the file content
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n").filter((line) => line.trim() !== "");

  // Calculate batch size
  const batchSize = Math.ceil(lines.length / workers);
  const batches = [];

  for (let i = 0; i < workers; i++) {
    const start = i * batchSize;
    const end = start + batchSize;
    batches.push(lines.slice(start, end));
  }

  return batches;
}

// Split the tasks and log the result
const batches = splitTasks(dictionaryPath, activeWorkers);
batches.forEach((batch, index) => {
  console.log(`Batch ${index + 1}:`, batch);
});
// Export the splitTasks function and activeWorkers for use in serverWebsocket
export { splitTasks, activeWorkers, dictionaryPath };