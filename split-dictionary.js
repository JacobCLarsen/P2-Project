import fs from "fs";
import path from "path";

// Path to the dictionary file
const dictionaryPath = path.join(process.cwd(), "dictionary.txt");

// Function to split the list into equal batches
function splitDictionary(filePath, numberBatches) {
  // Read the file content
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n").filter((line) => line.trim() !== "");

  // Calculate batch size
  const batchSize = Math.ceil(lines.length / numberBatches);
  const batches = [];

  for (let i = 0; i < numberBatches; i++) {
    const start = i * batchSize;
    const end = start + batchSize;
    batches.push(lines.slice(start, end));
  }

  return batches;
}

// Export the splitTasks function and activeWorkers for use in serverWebsocket
export { splitDictionary, dictionaryPath };
