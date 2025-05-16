// Import or define the function and dependencies
import {
  handleRequestTask,
  __setQueues__,
  __resetMocks__,
} from "./assigntaskutils.js"; // adjust the path as needed

jest.mock("./assigntaskutils.js", () => ({
  assignTaskFromCurrentQueue: jest.fn(),
  reassignUncompletedTask: jest.fn(),
  startNewMainTask: jest.fn(),
  notifyNoMoreTasks: jest.fn(),
  wsSend: jest.fn(),
}));

import {
  assignTaskFromCurrentQueue,
  reassignUncompletedTask,
  startNewMainTask,
  notifyNoMoreTasks,
} from "./assigntaskutils.js";

describe("handleRequestTask", () => {
  let mockWs;

  beforeEach(() => {
    mockWs = { id: "client1" };
    __resetMocks__();
  });

  test("should assign task from current queue if available", async () => {
    __setQueues__({
      currentTaskQueue: [{ id: "task1" }],
      taskWaitingForResult: [],
      mainTaskQueue: [],
    });

    await handleRequestTask(mockWs);

    expect(assignTaskFromCurrentQueue).toHaveBeenCalledWith(mockWs);
    expect(reassignUncompletedTask).not.toHaveBeenCalled();
    expect(notifyNoMoreTasks).not.toHaveBeenCalled();
  });

  test("should reassign uncompleted task if current queue is empty", async () => {
    __setQueues__({
      currentTaskQueue: [],
      taskWaitingForResult: [{ id: "task2" }],
      mainTaskQueue: [],
    });

    await handleRequestTask(mockWs);

    expect(reassignUncompletedTask).toHaveBeenCalledWith(mockWs);
    expect(assignTaskFromCurrentQueue).not.toHaveBeenCalled();
  });

  test("should start new main task and assign if possible", async () => {
    __setQueues__({
      currentTaskQueue: [],
      taskWaitingForResult: [],
      mainTaskQueue: [{ id: "main1" }],
    });

    startNewMainTask.mockReturnValue(true);

    await handleRequestTask(mockWs);

    expect(startNewMainTask).toHaveBeenCalled();
    expect(assignTaskFromCurrentQueue).toHaveBeenCalledWith(mockWs);
  });

  test("should notify no more tasks if startNewMainTask fails", async () => {
    __setQueues__({
      currentTaskQueue: [],
      taskWaitingForResult: [],
      mainTaskQueue: [{ id: "main1" }],
    });

    startNewMainTask.mockReturnValue(false);

    await handleRequestTask(mockWs);

    expect(startNewMainTask).toHaveBeenCalled();
    expect(assignTaskFromCurrentQueue).not.toHaveBeenCalled();
    expect(notifyNoMoreTasks).toHaveBeenCalledWith(mockWs);
  });

  test("should notify no more tasks if no queues have work", async () => {
    __setQueues__({
      currentTaskQueue: [],
      taskWaitingForResult: [],
      mainTaskQueue: [],
    });

    await handleRequestTask(mockWs);

    expect(notifyNoMoreTasks).toHaveBeenCalledWith(mockWs);
  });

  test("should handle errors and notify no more tasks", async () => {
    assignTaskFromCurrentQueue.mockImplementation(() => {
      throw new Error("Boom");
    });

    __setQueues__({
      currentTaskQueue: [{ id: "task1" }],
      taskWaitingForResult: [],
      mainTaskQueue: [],
    });

    await handleRequestTask(mockWs);

    expect(notifyNoMoreTasks).toHaveBeenCalledWith(mockWs);
  });
});
