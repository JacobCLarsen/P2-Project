import { jest } from "@jest/globals";

jest.unstable_mockModule("./assigntaskutils.js", async () => {
  const actual = await import("./assigntaskutils.js");
  return {
    ...actual,
    assignTaskFromCurrentQueue: jest.fn(),
    reassignUncompletedTask: jest.fn(),
    startNewMainTask: jest.fn(),
    notifyNoMoreTasks: jest.fn(),
    wsSend: jest.fn(),
    __setQueues__: jest.fn(),
    __resetMocks__: jest.fn(),
  };
});

const {
  handleRequestTask,
  __setQueues__,
  __resetMocks__,
  assignTaskFromCurrentQueue,
  reassignUncompletedTask,
  startNewMainTask,
  notifyNoMoreTasks,
} = await import("./assigntaskutils.js");

describe("handleRequestTask", () => {
  let mockWs;

  beforeEach(() => {
    mockWs = { id: "client1" };

    jest.clearAllMocks(); // resets all mock calls
  });

  test("should assign task from current queue if available", async () => {
    __setQueues__.mockImplementation(({ currentTaskQueue }) => {
      if (currentTaskQueue.length > 0) {
        assignTaskFromCurrentQueue(mockWs);
      }
    });

    __setQueues__({
      currentTaskQueue: [{ id: "task1" }],
      taskWaitingForResult: [],
      mainTaskQueue: [],
    });

    await handleRequestTask(mockWs);

    expect(assignTaskFromCurrentQueue).toHaveBeenCalledWith(mockWs);
  });

  test("should reassign uncompleted task if current is empty", async () => {
    __setQueues__.mockImplementation(
      ({ currentTaskQueue, taskWaitingForResult }) => {
        if (currentTaskQueue.length === 0 && taskWaitingForResult.length > 0) {
          reassignUncompletedTask(mockWs);
        }
      }
    );

    __setQueues__({
      currentTaskQueue: [],
      taskWaitingForResult: [{ id: "task2" }],
      mainTaskQueue: [],
    });

    await handleRequestTask(mockWs);

    expect(reassignUncompletedTask).toHaveBeenCalledWith(mockWs);
  });

  test("should start new main task and assign if possible", async () => {
    startNewMainTask.mockReturnValue(true);

    __setQueues__.mockImplementation(({ mainTaskQueue }) => {
      if (mainTaskQueue.length > 0) {
        startNewMainTask();
        assignTaskFromCurrentQueue(mockWs);
      }
    });

    __setQueues__({
      currentTaskQueue: [],
      taskWaitingForResult: [],
      mainTaskQueue: [{ id: "main1" }],
    });

    await handleRequestTask(mockWs);

    expect(startNewMainTask).toHaveBeenCalled();
    expect(assignTaskFromCurrentQueue).toHaveBeenCalledWith(mockWs);
  });

  test("should notify no more tasks if startNewMainTask fails", async () => {
    startNewMainTask.mockReturnValue(false);

    __setQueues__.mockImplementation(({ mainTaskQueue }) => {
      if (mainTaskQueue.length > 0) {
        if (!startNewMainTask()) {
          notifyNoMoreTasks(mockWs);
        }
      }
    });

    __setQueues__({
      currentTaskQueue: [],
      taskWaitingForResult: [],
      mainTaskQueue: [{ id: "main1" }],
    });

    await handleRequestTask(mockWs);

    expect(startNewMainTask).toHaveBeenCalled();
    expect(notifyNoMoreTasks).toHaveBeenCalledWith(mockWs);
  });

  test("should notify no more tasks if all queues are empty", async () => {
    __setQueues__.mockImplementation(
      ({ currentTaskQueue, taskWaitingForResult, mainTaskQueue }) => {
        if (
          currentTaskQueue.length === 0 &&
          taskWaitingForResult.length === 0 &&
          mainTaskQueue.length === 0
        ) {
          notifyNoMoreTasks(mockWs);
        }
      }
    );

    __setQueues__({
      currentTaskQueue: [],
      taskWaitingForResult: [],
      mainTaskQueue: [],
    });

    await handleRequestTask(mockWs);

    expect(notifyNoMoreTasks).toHaveBeenCalledWith(mockWs);
  });

  test("should handle error and notify no more tasks", async () => {
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
