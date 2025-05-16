import { handleResultReceived } from "./handleResultReceived.js"; // Update path as needed

import { jest } from "@jest/globals";

let mockComplete;
let mockStorePasswordsOnDatabase;
let mockAddPoints;
let mockUpdateTaskQueue;
let mockUpdateCompletedTasks;

beforeEach(() => {
  // Reset global state
  global.taskWaitingForResult = [];
  global.mainTaskQueue = [];
  global.weakPasswordcount = 0;
  global.completedTaskCount = 0;

  // Mock global functions
  mockComplete = jest.fn();
  mockStorePasswordsOnDatabase = jest.fn();
  mockAddPoints = jest.fn();
  mockUpdateTaskQueue = jest.fn();
  mockUpdateCompletedTasks = jest.fn();

  global.storePasswordsOnDatabase = mockStorePasswordsOnDatabase;
  global.addPoints = mockAddPoints;
  global.updateTaskQueue = mockUpdateTaskQueue;
  global.updateCompletedTasks = mockUpdateCompletedTasks;
});

test("logs no result if message.result is undefined", async () => {
  const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  const message = { taskId: "abc123", user_id: "user1" };

  await handleResultReceived(message);

  expect(consoleSpy).toHaveBeenCalledWith(
    expect.stringContaining("No passwords found")
  );
  expect(mockAddPoints).toHaveBeenCalledWith(1, "user1");
  consoleSpy.mockRestore();
});

test("completes subtask and updates main task with result", async () => {
  const mockTask = { id: "task1", complete: mockComplete };
  const mainTask = {
    id: "main1",
    subTasksCompleted: 0,
    numberBatches: 2,
    results: [],
  };

  global.taskWaitingForResult = [mockTask];
  global.mainTaskQueue = [mainTask];

  const message = {
    taskId: "task1",
    user_id: "user1",
    result: ["weak1", "weak2"],
  };

  await handleResultReceived(message);

  expect(mockComplete).toHaveBeenCalled();
  expect(global.taskWaitingForResult).toHaveLength(0);
  expect(mainTask.results).toEqual(["weak1", "weak2"]);
  expect(mainTask.subTasksCompleted).toBe(1);
});

test("stores task on DB if all subtasks are completed", async () => {
  const mockTask = { id: "task2", complete: mockComplete };
  const mainTask = {
    id: "main2",
    subTasksCompleted: 1,
    numberBatches: 2,
    results: [],
  };

  global.taskWaitingForResult = [mockTask];
  global.mainTaskQueue = [mainTask];

  const message = {
    taskId: "task2",
    user_id: "user1",
    result: ["r1"],
  };

  await handleResultReceived(message);

  expect(mockStorePasswordsOnDatabase).toHaveBeenCalledWith(
    expect.objectContaining({
      id: "main2",
      results: ["r1"],
    })
  );
});

test("logs when task is already completed and not in waiting queue", async () => {
  global.taskWaitingForResult = [];
  const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  const message = {
    taskId: "unknown",
    user_id: "user1",
    result: ["x"],
  };

  await handleResultReceived(message);

  expect(consoleSpy).toHaveBeenCalledWith(
    expect.stringContaining("already been completed")
  );
  consoleSpy.mockRestore();
});

test("logs if main task is already removed", async () => {
  const mockTask = { id: "task3", complete: mockComplete };
  global.taskWaitingForResult = [mockTask];
  global.mainTaskQueue = [];

  const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  const message = {
    taskId: "task3",
    user_id: "user1",
    result: ["p1"],
  };

  await handleResultReceived(message);

  expect(consoleSpy).toHaveBeenCalledWith(
    expect.stringContaining("Maintask already complted")
  );
  consoleSpy.mockRestore();
});

test("adds points and updates UI counters", async () => {
  const mockTask = { id: "task4", complete: mockComplete };
  const mainTask = {
    id: "main4",
    subTasksCompleted: 0,
    numberBatches: 1,
    results: [],
  };

  global.taskWaitingForResult = [mockTask];
  global.mainTaskQueue = [mainTask];

  const message = {
    taskId: "task4",
    user_id: "user2",
    result: [],
  };

  await handleResultReceived(message);

  expect(mockAddPoints).toHaveBeenCalledWith(1, "user2");
  expect(mockUpdateTaskQueue).toHaveBeenCalled();
  expect(mockUpdateCompletedTasks).toHaveBeenCalled();
});
