// TODO: this shuld instead hash the list of dictionary words and the check for matches after
// TODO: use encryption with the owners public key
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
  let weakPasswordArray = [];
  // "For of" loop that goes through each password of the dictionary.
  for (let dictionaryWord of dictionaryBatch) {
    for (let targetHash of targetHashes) {
      // Hashes the current password and assigns it to the const hashedPassword.
      const hashedWord = await hashSHA512(dictionaryWord);
      // If hashedPassword is equal to the target hashed password, then returns correct password
      if (hashedWord === targetHash) {
        weakPasswordArray.push(dictionaryWord);
      }
    }
  }

  return weakPasswordArray;
}

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
