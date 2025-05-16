import { startNewTask } from "../../server/tasks/startNewtask";

// At the top
let currentTaskQueue = [];
let taskWaitingForResult = [];
let mainTaskQueue = [];

function __setQueues__({
  currentTaskQueue: c,
  taskWaitingForResult: w,
  mainTaskQueue: m,
}) {
  currentTaskQueue = c;
  taskWaitingForResult = w;
  mainTaskQueue = m;
}

function __resetMocks__() {
  jest.clearAllMocks();
}

async function handleRequestTask(ws) {
  console.log(`Client ${ws.id} requested a task`);

  try {
    if (currentTaskQueue.length > 0) {
      assignTaskFromCurrentQueue(ws);
    } else if (taskWaitingForResult.length > 0) {
      await reassignUncompletedTask(ws);
    } else if (mainTaskQueue.length > 0) {
      if (startNewMainTask()) {
        assignTaskFromCurrentQueue(ws);
      } else {
        console.error("Failed to start a new main task.");
        notifyNoMoreTasks(ws);
      }
    } else {
      notifyNoMoreTasks(ws);
    }
  } catch (err) {
    console.error("Error handling task request:", err);
    notifyNoMoreTasks(ws);
  }

  // Debug
  console.log(mainTaskQueue.length);
  console.log(currentTaskQueue.length);
  console.log(taskWaitingForResult.length);
}

// Helper functions for handleRequestTask
function assignTaskFromCurrentQueue(ws) {
  console.log("Assigning task from current queue");

  const taskToSend = currentTaskQueue.shift();
  if (!taskToSend) {
    console.warn("No task available to assign from current queue.");
    notifyNoMoreTasks(ws);
    return;
  }

  taskToSend.retries = taskToSend.retries || 0; // Initialize retries if undefined
  taskWaitingForResult.push(taskToSend);

  const success = wsSend(ws, {
    action: "new task",
    subTask: taskToSend,
  });

  if (!success) {
    console.error(
      `Failed to send task ${taskToSend.id}. Removing from waiting list.`
    );
    taskWaitingForResult.pop(); // Remove it if failed to send
    currentTaskQueue.unshift(taskToSend); // Requeue for later
  } else {
    console.log(`Task ${taskToSend.id} sent to client ${ws.id}`);
  }
}

async function reassignUncompletedTask(ws) {
  console.log("Reassigning uncompleted task");

  const taskToSend = taskWaitingForResult.shift();
  if (!taskToSend) {
    console.warn("No uncompleted task available for reassignment.");
    notifyNoMoreTasks(ws);
    return;
  }

  taskToSend.retries = (taskToSend.retries || 0) + 1;

  if (taskToSend.retries > MAX_TASK_RETRIES) {
    console.warn(`Task ${taskToSend.id} exceeded max retries. Discarding.`);
    // Optionally log, escalate, or store failed tasks elsewhere
    return reassignUncompletedTask(ws); // Try another task
  }

  taskWaitingForResult.push(taskToSend); // Rotate back

  const success = wsSend(ws, {
    action: "new task",
    subTask: taskToSend,
  });

  if (!success) {
    console.error(`Failed to send reassigned task ${taskToSend.id}.`);
  } else {
    console.log(
      `Uncompleted task ${taskToSend.id} reassigned to client ${ws.id}`
    );
  }
}

function notifyNoMoreTasks(ws) {
  console.log(`No more tasks available for client ${ws.id}`);
  wsSend(ws, { action: "no more tasks" });
}

// Helper to send a message
function wsSend(ws, data) {
  if (ws.readyState === ws.OPEN) {
    ws.send(JSON.stringify(data));
    return true;
  } else {
    console.error(`WebSocket not open for client ${ws.id}`);
    return false;
  }
}

export {
  handleRequestTask,
  __setQueues__,
  __resetMocks__,
  handleRequestTask,
  reassignUncompletedTask,
  startNewTask,
  wsSend,
  assignTaskFromCurrentQueue,
  notifyNoMoreTasks,
};
