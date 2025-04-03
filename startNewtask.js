import { splitDictionary, dictionaryPath } from "./split-dictionary.js";
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
function startNewTask(task, numberBatches) {
  let subTaskArray = [];
  let bachesArray = splitDictionary(numberBatches);

  bachesArray.forEach((batch) => {
    const subTask = new SubTask(batch, task.hashes);
    subTaskArray.push(subTask);
  });

  return subTaskArray;
}

export { startNewTask };
