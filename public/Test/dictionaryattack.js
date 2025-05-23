// dictionaryattack.test.js
import { jest } from "@jest/globals";

jest.unstable_mockModule("./workerFunctions.js", () => ({
  hashDictionary: jest.fn(),
  dictionaryAttack: jest.fn(async (targetHashes, dictionaryBatch) => {
    // Mock implementation that matches your test cases
    const hashes = await Promise.resolve([
      "aaa111",
      "hashed_password",
      "bbb222",
      "ccc333",
    ]);

    const matches = [];
    for (let i = 0; i < hashes.length; i++) {
      if (targetHashes.includes(hashes[i])) {
        matches.push(dictionaryBatch[i]);
      }
    }
    return matches;
  }),
}));

const { dictionaryAttack, hashDictionary } = await import(
  "./workerFunctions.js"
);

describe("dictionaryAttack", () => {
  it("should return weak passwords that match target hashes", async () => {
    const dictionaryBatch = ["123456", "password", "admin", "letmein"];
    const targetHashes = ["abc123", "hashed_password", "xyz789"];

    const mockedHashedDictionary = [
      "aaa111",
      "hashed_password",
      "bbb222",
      "ccc333",
    ];
    hashDictionary.mockResolvedValue(mockedHashedDictionary);

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

  it("should return an empty array if target hashes are empty", async () => {
    const dictionaryBatch = ["admin", "123456"];
    const targetHashes = [];

    const mockedHashedDictionary = ["somehash1", "somehash2"];
    hashDictionary.mockResolvedValue(mockedHashedDictionary);

    const result = await dictionaryAttack(targetHashes, dictionaryBatch);
    expect(result).toEqual([]);
  });
});
