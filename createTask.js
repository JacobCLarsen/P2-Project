class Task {
  constructor(hashes, numberBatches, publicKey) {
    this.hashes = hashes;
    this.size = hashes.length;
    this.encryptionKey = publicKey;
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

export function createTask(hashes, publicKey) {
  // Divide into chuncks of 100 hashes
  const numBatches = Math.ceil(hashes.length / 50);

  // Create a new task with the given hashes and number of batches
  const newTask = new Task(hashes, numBatches, publicKey);

  return newTask;
}

export { Task };
