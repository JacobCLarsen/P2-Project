// This worker script takes
onmessage = async (e) => {
  console.log("Message received from main script:");

  // Crack hashes
  let weakPasswords = await dictionaryAttack(e.data.hashes, e.data.dictionary);

  if (weakPasswords.length > 0) {
    const workerResult = weakPasswords;
    console.log(
      `weak passwords found: ${weakPasswords} in subtask ${e.data.id}`
    );

    console.log("Posting message back to main script");
    postMessage(workerResult);
  } else {
    console.log(`no weak passwords in task ${e.data.id}`);
    postMessage(null);
  }
};

async function dictionaryAttack(targetHashes, dictionaryBatch) {
  // Array to store any weak passwords found
  let weakPasswordArray = [];

  // Hash the dictionary
  const hashedDictionary = await hashDictionary(dictionaryBatch);

  // Log each set for debugging
  console.log("dictionary:", hashedDictionary);
  console.log("hashes:", targetHashes);

  // Create a map of target hashes for quick lookup
  const targetHashSet = new Set(targetHashes);

  // Compare each hashed dictionary word with the target hashes
  hashedDictionary.forEach((hashedWord, index) => {
    if (targetHashSet.has(hashedWord)) {
      weakPasswordArray.push(dictionaryBatch[index]);
    }
  });
  return weakPasswordArray;
}

async function dictionaryAttackReturnHashes(targetHashes, dictionaryBatch) {
  // Array to store any weak hashes found
  let weakHashArray = [];

  // Hash the dictionary
  const hashedDictionary = await hashDictionary(dictionaryBatch);

  // Log each set for debugging
  console.log("dictionary:", hashedDictionary);
  console.log("hashes:", targetHashes);

  // Create a map of target hashes for quick lookup
  const targetHashSet = new Set(targetHashes);

  // Compare each hashed dictionary word with the target hashes
  hashedDictionary.forEach((hashedWord) => {
    if (targetHashSet.has(hashedWord)) {
      weakHashArray.push(hashedWord);
    }
  });
  return weakHashArray;
}

// Function to hash the dictionary
async function hashDictionary(dictionary) {
  return Promise.all(dictionary.map(async (word) => await hashSHA512(word)));
}

// Helper function to hash a message with SHA-512
async function hashSHA512(message) {
  const encoder = new TextEncoder(); // Converts string into binary format
  const data = encoder.encode(message); // Transfors the text into bytes
  const hashBuffer = await crypto.subtle.digest("SHA-512", data); // Computes the SHA-512 hash of the input
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // Converts hashBuffer to hex string
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}
