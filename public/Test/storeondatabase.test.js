import { storePasswordsOnDatabase } from "./storeOnDatabase.js"; // Adjust path
import DBConnection from "./DBconnection.js";

import { jest } from "@jest/globals";

const mockQuery = jest.fn();

beforeEach(() => {
  global.DBConnection = {
    query: mockQuery,
  };

  jest.clearAllMocks();
  console.error = jest.fn(); // Suppress/log error output during test
  console.log = jest.fn(); // Suppress/log console output
});

test("inserts passwords from array", async () => {
  const task = {
    results: ["pass1", "pass2"],
    user_id: 123,
  };

  await storePasswordsOnDatabase(task);

  expect(mockQuery).toHaveBeenCalledTimes(2);
  expect(mockQuery).toHaveBeenCalledWith(
    "INSERT INTO passwords (password, user_id) VALUES (?, ?)",
    ["pass1", 123],
    expect.any(Function)
  );
  expect(mockQuery).toHaveBeenCalledWith(
    "INSERT INTO passwords (password, user_id) VALUES (?, ?)",
    ["pass2", 123],
    expect.any(Function)
  );
});

test("parses and inserts passwords from string", async () => {
  const task = {
    results: "  one, two ,three ",
    user_id: 321,
  };

  await storePasswordsOnDatabase(task);

  expect(mockQuery).toHaveBeenCalledTimes(3);
  expect(mockQuery).toHaveBeenNthCalledWith(
    1,
    expect.any(String),
    ["one", 321],
    expect.any(Function)
  );
  expect(mockQuery).toHaveBeenNthCalledWith(
    2,
    expect.any(String),
    ["two", 321],
    expect.any(Function)
  );
  expect(mockQuery).toHaveBeenNthCalledWith(
    3,
    expect.any(String),
    ["three", 321],
    expect.any(Function)
  );
});

test("logs error if passwords are missing or invalid", async () => {
  const invalidTasks = [
    { results: null, user_id: 1 },
    { results: ["abc"], user_id: null },
    { results: undefined, user_id: 5 },
  ];

  for (const task of invalidTasks) {
    await storePasswordsOnDatabase(task);
    expect(console.error).toHaveBeenCalledWith(
      "Error storing passwords:",
      expect.any(Error)
    );
  }

  expect(mockQuery).not.toHaveBeenCalled();
});

test("logs error from DB query", async () => {
  mockQuery.mockImplementation((query, params, cb) =>
    cb(new Error("DB failed"))
  );

  const task = {
    results: ["fail"],
    user_id: 999,
  };

  await storePasswordsOnDatabase(task);

  expect(console.error).toHaveBeenCalledWith(
    "Error inserting password:",
    expect.any(Error)
  );
});
