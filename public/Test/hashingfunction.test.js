import { hashDictionary } from "./workerFunctions.js"; // adjust the path as needed

describe("hashDictionary", () => {
  it("should return an array of SHA-512 hashes in hex format", async () => {
    const input = ["password", "123456"];
    const result = await hashDictionary(input);

    // Check length
    expect(result).toHaveLength(2);

    // SHA-512 outputs 512 bits = 128 hex chars
    result.forEach(hash => {
      expect(typeof hash).toBe("string");
      expect(hash).toMatch(/^[a-f0-9]{128}$/);
    });
  });

  it("should return an empty array if input is empty", async () => {
    const result = await hashDictionary([]);
    expect(result).toEqual([]);
  });

  it("should return consistent hashes for the same input", async () => {
    const input = ["repeated"];
    const result1 = await hashDictionary(input);
    const result2 = await hashDictionary(input);

    expect(result1).toEqual(result2);
  });

  it("should hash different inputs to different outputs", async () => {
    const input = ["foo", "bar"];
    const result = await hashDictionary(input);

    expect(result[0]).not.toEqual(result[1]);
  });

  it("should handle special characters correctly", async () => {
    const input = ["!@#€%&*()_+", "你好", "123😃"];
    const result = await hashDictionary(input);

    result.forEach(hash => {
      expect(typeof hash).toBe("string");
      expect(hash).toMatch(/^[a-f0-9]{128}$/);
    });
  });
})