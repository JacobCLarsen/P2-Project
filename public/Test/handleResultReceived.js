export async function handleResultReceived(message) {
  // Check if a result was received or no weak passwords were found
  if (!message.result) {
    console.log(
      `Result received from the worker: No passwords found in subtask: ${message.taskId}`
    );
  } else {
    console.log(`Result from worker received: ${message.result}`);
    weakPasswordcount += message.result.length; // Update weakPasswordsFoundCounter for dashboard.html
  }

  // Scan the currentTaskQueue for a matching task ID and mark completed
  let matchingTask = taskWaitingForResult.find(
    (task) => task.id === message.taskId
  );

  if (matchingTask) {
    // Call complete() on the matching subtask
    matchingTask.complete();

    // Remove from taskWaitingForResult
    taskWaitingForResult = taskWaitingForResult.filter(
      (task) => task.id !== matchingTask.id
    );

    // Push results to the task object's array for results
    if (mainTaskQueue[0]) {
      if (message.result) {
        // if result is not empty
        mainTaskQueue[0].results.push(...message.result); // Spread and insert each array item
      }
      mainTaskQueue[0].subTasksCompleted++; // Update the number of completed subtasks of the main task

      // If the whole task is now completed
      if (
        mainTaskQueue[0].subTasksCompleted === mainTaskQueue[0].numberBatches
      ) {
        // Use this completed task and store it somewhere
        let completed_task = mainTaskQueue.shift();
        console.log(
          `Task was completed with id: ${completed_task.id} and result ${completed_task.results}`
        );

        // Send the results of the task to the server
        await storePasswordsOnDatabase(completed_task);
      }
    } else {
      console.log(`Maintask already complted and removed from the main queue`);
    }

    console.log(`Subtask with ID ${message.taskId} marked as complete.`);
  } else {
    console.log(
      `Task ${message.taskId} has already been completed by another node and removed from the waiting for result queue`
    );
  }

  // Give the user points for working and submitting
  addPoints(1, message.user_id);

  // Update completed task counter and taskqueue for dashboard and clients
  updateTaskQueue();
  updateCompletedTasks();
}
