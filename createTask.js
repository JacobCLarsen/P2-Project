class Task {
  constructor(hashes) {
    this.hashes = hashes;
    this.size = hashes.length;
    this.completed = 0;
    this.id = Math.floor(10000000 + Math.random() * 90000000);
  }
  complete() {
    this.completed = 1;
  }
}

export { Task };
