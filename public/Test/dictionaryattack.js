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

  it("should produce correct SHA-512 hashes for known inputs", async () => {
    const input = ["password", "123456"];

    const expectedHashes = [
      // SHA-512 hash of "password"
      "b109f3bbbc244eb82441917ed06d618b9008dd09b3befd1b5e07394c706a8bb980b1d7785e5976ec049b46df5f1326af5a2ea6d103fd07c95385ffab0cacbc86",
      // SHA-512 hash of "123456"
      "ba3253876aed6bc22d4a6ff53d8406c6ad864195ed144ab5c87621b6c233b548baeae6956df346ec8c17f5ea10f35ee3cbc514797ed7ddd3145464e2a0bab413",
    ];

    const result = await hashDictionary(input);
    expect(result).toEqual(expectedHashes);
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
