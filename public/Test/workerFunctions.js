// workerLogic.js
export async function dictionaryAttack(targetHashes, dictionaryBatch) {
  const hashedDictionary = await hashDictionary(dictionaryBatch);
  const targetHashSet = new Set(targetHashes);

  return dictionaryBatch.filter((_, index) =>
    targetHashSet.has(hashedDictionary[index])
  );
}

export async function hashDictionary(dictionary) {
  return Promise.all(dictionary.map(hashSHA512));
}

async function hashSHA512(message) {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-512", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
