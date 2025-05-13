// dictionaryAttack.test.js

import { jest } from "@jest/globals";
import { dictionaryAttack } from "../public/js/worker.js";
import * as dictionaryUtils from "../public/js/worker.js";

describe("dictionaryAttack", () => {
  beforeEach(() => {
    // Reset mock between tests
    jest.restoreAllMocks();
  });

  it("should return weak passwords that match target hashes", async () => {
    const dictionaryBatch = ["123456", "password", "admin", "letmein"];
    const targetHashes = ["abc123", "hashed_password", "xyz789"];

    // Mock the hashDictionary function inside the module
    jest
      .spyOn(dictionaryUtils, "hashDictionary")
      .mockResolvedValue(["aaa111", "hashed_password", "bbb222", "ccc333"]);

    const result = await dictionaryAttack(targetHashes, dictionaryBatch);
    expect(result).toEqual(["password"]);
  });

  it("should return an empty array if no matches found", async () => {
    const dictionaryBatch = ["123456", "password"];
    const targetHashes = ["no_match1", "no_match2"];

    jest
      .spyOn(dictionaryUtils, "hashDictionary")
      .mockResolvedValue(["hash1", "hash2"]);

    const result = await dictionaryAttack(targetHashes, dictionaryBatch);
    expect(result).toEqual([]);
  });

  it("should handle an empty dictionary", async () => {
    const dictionaryBatch = [];
    const targetHashes = ["hash1"];

    jest.spyOn(dictionaryUtils, "hashDictionary").mockResolvedValue([]);

    const result = await dictionaryAttack(targetHashes, dictionaryBatch);
    expect(result).toEqual([]);
  });
});
