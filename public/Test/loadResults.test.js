import { jest } from "@jest/globals";

// Mock dependencies
global.fetch = jest.fn();
const mockShowResults = jest.fn();
const mockShowNoResults = jest.fn();
const mockAuthenticateUser = jest.fn();

jest.unstable_mockModule("./loadResultsUtils.js", () => ({
  authenticateUser: mockAuthenticateUser,
  showResults: mockShowResults,
  shownoResults: mockShowNoResults,
}));

// Now import the function under test
const { loadResults, authenticateUser, showResults, shownoResults } =
  await import("./loadResultsUtils.js"); // Adjust the path

describe("loadResults", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("fetches and displays passwords on success", async () => {
    mockAuthenticateUser.mockResolvedValue({ userId: 101 });

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        passwords: [{ password: "123" }, { password: "abc" }],
      }),
    });

    await loadResults();

    expect(authenticateUser).toHaveBeenCalled();
    expect(fetch).toHaveBeenCalledWith(
      "passwordsDB?user_id=101",
      expect.any(Object)
    );
    expect(showResults).toHaveBeenCalledWith(["123", "abc"]);
    expect(shownoResults).not.toHaveBeenCalled();
  });

  test("shows no results if password list is empty", async () => {
    mockAuthenticateUser.mockResolvedValue({ userId: 202 });

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        passwords: [],
      }),
    });

    await loadResults();

    expect(showResults).not.toHaveBeenCalled();
    expect(shownoResults).toHaveBeenCalled();
  });

  test("handles fetch failure", async () => {
    mockAuthenticateUser.mockResolvedValue({ userId: 303 });

    fetch.mockResolvedValueOnce({
      ok: false,
    });

    await loadResults();

    expect(console.error).toHaveBeenCalledWith(
      "Error fetching hashes",
      expect.any(Error)
    );
    expect(showResults).not.toHaveBeenCalled();
  });

  test("handles authentication failure", async () => {
    mockAuthenticateUser.mockRejectedValue(new Error("Auth failed"));

    await loadResults();

    expect(console.error).toHaveBeenCalledWith(
      "Error during authentication or fetching data:",
      expect.any(Error)
    );
    expect(fetch).not.toHaveBeenCalled();
  });

  test("handles fetch throw", async () => {
    mockAuthenticateUser.mockResolvedValue({ userId: 404 });

    fetch.mockRejectedValue(new Error("Network error"));

    await loadResults();

    expect(console.error).toHaveBeenCalledWith(
      "Error fetching hashes",
      expect.any(Error)
    );
  });
});
