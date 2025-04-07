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

export { Task };
