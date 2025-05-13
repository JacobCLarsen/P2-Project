// Test/dictionaryattack.test.js
import { jest } from "@jest/globals";
import { dictionaryAttack, hashDictionary } from "./workerFunctions.js";

// Mock before importing
jest.unstable_mockModule("./workerFunctions.js", () => ({
  hashDictionary: jest.fn(),
}));

// Must be imported after mock
const { dictionaryAttack, hashDictionary } = await import(
  "./workerFunctions.js"
);

describe("dictionaryAttack", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return weak passwords that match target hashes", async () => {
    const dictionaryBatch = ["123456", "password", "admin", "letmein"];
    const targetHashes = ["abc123", "hashed_password", "xyz789"];

    hashDictionary.mockResolvedValue([
      "aaa111",
      "hashed_password",
      "bbb222",
      "ccc333",
    ]);

    const result = await dictionaryAttack(targetHashes, dictionaryBatch);
    expect(result).toEqual(["password"]);
  });

  it("should return an empty array if no matches found", async () => {
    const dictionaryBatch = ["123456", "password"];
    const targetHashes = ["no_match1", "no_match2"];

    hashDictionary.mockResolvedValue(["hash1", "hash2"]);

    const result = await dictionaryAttack(targetHashes, dictionaryBatch);
    expect(result).toEqual([]);
  });

  it("should handle an empty dictionary", async () => {
    const dictionaryBatch = [];
    const targetHashes = ["hash1"];

    hashDictionary.mockResolvedValue([]);

    const result = await dictionaryAttack(targetHashes, dictionaryBatch);
    expect(result).toEqual([]);
  });
});
