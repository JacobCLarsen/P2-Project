// The task object holds all information about a task, and is added to the main queue
// It holds an array of hashes from the user, the number of hashes, the number of batches to split the task
// as well as some variables to keep track of the task status and complesion
class Task {
  constructor(hashes, numberBatches, user_id) {
    this.hashes = hashes;
    this.size = hashes.length;
    this.numberBatches = numberBatches;
    this.subTasksCompleted = 0;
    this.completed = 0;
    this.id = Math.floor(10000000 + Math.random() * 90000000); // ID to keep track of task complesion
    this.results = [];
    this.user_id = user_id
  }

  // Function to mark the task as completed
  complete() {
    this.completed = 1;
  }
}

// Constructor of the a new task, from a list of hashes
export function createTask(hashes, user_id) {
  const numBatches = Math.ceil(hashes.length / 500);
  const newTask = new Task(hashes, numBatches, user_id); // Create a new task with the given hashes and number of batches

  return newTask;
}

export { Task };
