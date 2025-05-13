import { hashDictionary } from "./workerFunctions.js"; // adjust the path as needed

describe("hashDictionary", () => {
  it("should return an array of SHA-512 hashes in hex format", async () => {
    const input = ["password", "123456"];
    const result = await hashDictionary(input);

    // Check length
    expect(result).toHaveLength(2);

    // SHA-512 outputs 512 bits = 128 hex chars
    result.forEach((hash) => {
      expect(typeof hash).toBe("string");
      expect(hash).toMatch(/^[a-f0-9]{128}$/);
    });
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

    result.forEach((hash) => {
      expect(typeof hash).toBe("string");
      expect(hash).toMatch(/^[a-f0-9]{128}$/);
    });
  });
});
