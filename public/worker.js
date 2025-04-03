//import { dictionaryAttack } from "./dictionary-attack";

// This worker script takes
onmessage = (e) => {
  console.log("hello from the worker");

  console.log(`Message received from main script: ${e.data.hashes}`);
  console.log(`and dictionary ${e.data.dictionary}`);

  // Crack hashes
  let weakPasswords = dictionaryAttack(e.data.hashes, e.data.dictionary);

  if (weakPasswords) {
    const workerResult = weakPasswords;
    console.log(`weak passwords found: ${weakPasswords}`);

    console.log("Posting message back to main script");
    postMessage(workerResult);
  } else {
    console.log(`no weak passwords in task ${e.data.id}`);
  }
};

function dictionaryAttack(targetHashes, dictionaryBatch) {
  let weakPasswordArray = [];
  // "For of" loop that goes through each password of the dictionary.
  for (let dictionaryWord of dictionaryBatch) {
    for (let targetHash of targetHashes) {
      // Hashes the current password and assigns it to the const hashedPassword.
      const hashedWord = hashSHA512(dictionaryWord);
      // If hashedPassword is equal to the target hashed password, then returns correct password.
      if (hashedWord === targetHash) {
        console.log(`password found: ${dictionaryWord}`);
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
