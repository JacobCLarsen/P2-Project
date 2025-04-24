import { splitDictionary, dictionaryPath } from "./split-dictionary.js"; // Corrected path

// Create class to represent a subtask
// Is is constructed with a dictionary batch and a list of hashes to crack
class SubTask {
  constructor(dictionary, hashes) {
    this.dictionary = dictionary;
    this.hashes = hashes;
    this.completed = 0;
    this.id = Math.floor(10000000 + Math.random() * 90000000);
  }
  complete() {
    this.completed = 1;
  }
}

// Function to create a subtask for each dictionary batch and pair it with the hashlist
function startNewTask(task) {
  const numberBatches = task.numberBatches;
  // Validate input parameters
  if (!task || !Array.isArray(task.hashes)) {
    throw new Error("Invalid task object. 'hashes' must be an array.");
  }
  if (typeof numberBatches !== "number" || numberBatches <= 0) {
    throw new Error("Invalid numberBatches. It must be a positive number.");
  }

  // Split dictionary into batches
  const batchesArray = splitDictionary(dictionaryPath, numberBatches);
  if (!Array.isArray(batchesArray)) {
    throw new Error("splitDictionary must return an array.");
  }

  // Create sub-tasks using map for cleaner code
  return batchesArray.map((batch) => new SubTask(batch, task.hashes));
}

export { startNewTask };
