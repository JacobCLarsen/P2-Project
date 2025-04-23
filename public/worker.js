// TODO: this shuld instead hash the list of dictionary words and the check for matches after
// TODO: Implement the websocket logic directly inside of the webworker, to have the webworker send back the result directly to the server

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

// Function to hash the dictionary
async function hashDictionary(dictionary) {
  return Promise.all(dictionary.map(async (word) => await hashSHA512(word)));
}

// Helper function to hash a message with SHA-512
async function hashSHA512(message) {
  // Converts string into binary format
  const encoder = new TextEncoder();
  // Transfors the text into bytes
  const data = encoder.encode(message);
  // Computes the SHA-512 hash of the input
  const hashBuffer = await crypto.subtle.digest("SHA-512", data);
  // Converts hashBuffer to hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  // Converts each byte into hexadecimal
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}
