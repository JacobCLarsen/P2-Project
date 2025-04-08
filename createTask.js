class Task {
  constructor(hashes, numberBatches) {
    this.hashes = hashes;
    this.size = hashes.length;
    this.numberBatches = numberBatches;
    this.subTasksCompleted = 0;
    this.completed = 0;
    this.id = Math.floor(10000000 + Math.random() * 90000000);
    this.results = [];
  }
  complete() {
    this.completed = 1;
  }
}

export function createTask(hashes) {
  // Divide into chuncks of 100 hashes
  const numBatches = Math.floor(hashes.length / 100);

  // Create a new task with the given hashes and number of batches
  const newTask = new Task(hashes, numBatches);

  return newTask;
}

export { Task };
