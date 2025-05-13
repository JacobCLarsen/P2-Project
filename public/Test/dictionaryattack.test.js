// Import the function to test
const { dictionaryAttack, hashDictionary } = require("worker.js");

// Mock the hashDictionary dependency
jest.mock("worker.js", () => ({
  hashDictionary: jest.fn(),
}));

describe("dictionaryAttack", () => {
  it("should return weak passwords that match target hashes", async () => {
    const dictionaryBatch = ["123456", "password", "admin", "letmein"];
    const targetHashes = ["abc123", "hashed_password", "xyz789"];

    // Mocked hashed output of dictionaryBatch
    const mockedHashedDictionary = [
      "aaa111",
      "hashed_password",
      "bbb222",
      "ccc333",
    ];
    hashDictionary.mockResolvedValue(mockedHashedDictionary);

    // Import function under test after mocking
    const { dictionaryAttack } = require("Test/worker.js");

    const result = await dictionaryAttack(targetHashes, dictionaryBatch);

    expect(result).toEqual(["password"]);
  });

  it("should return an empty array if no matches found", async () => {
    const dictionaryBatch = ["123456", "password"];
    const targetHashes = ["no_match1", "no_match2"];

    const mockedHashedDictionary = ["hash1", "hash2"];
    hashDictionary.mockResolvedValue(mockedHashedDictionary);

    const result = await dictionaryAttack(targetHashes, dictionaryBatch);

    expect(result).toEqual([]);
  });

  it("should handle an empty dictionary", async () => {
    const dictionaryBatch = [];
    const targetHashes = ["hash1"];

    const mockedHashedDictionary = [];
    hashDictionary.mockResolvedValue(mockedHashedDictionary);

    const result = await dictionaryAttack(targetHashes, dictionaryBatch);

    expect(result).toEqual([]);
  });
});
