// TODO: Implement the websocket logic directly inside of the webworker, to have the webworker send back the result directly to the server

import { rsaUtils } from "./rsaFunction.js";

// As crypto-js is installed only onto the main thread, it is added to the worker also
importScripts(
  "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js"
);
const crypto = self.CryptoJS;

// This worker script takes
onmessage = async (e) => {
  try {
    console.log("Message received from main script:", e.data);

    // Step 1: Hash the dictionary
    const hashedDictionary = await hashDictionary(e.data.dictionary);

    // Step 2: Encrypt each hashed word in the dictionary using the public key
    const encryptedDictionary = await encryptDictionary(
      hashedDictionary,
      "12345"
    );

    // Step 3: Compare encrypted hashes with target encrypted hashes
    const weakPasswords = await dictionaryAttack(
      e.data.hashes,
      encryptedDictionary
    );

    // Step 4: Return a result bases on if weak passwords where found or not
    if (weakPasswords.length > 0) {
      console.log(
        `Weak passwords found: ${weakPasswords} in subtask ${e.data.id}`
      );
      postMessage(weakPasswords);
    } else {
      console.log(`No weak passwords in task ${e.data.id}`);
      postMessage(null);
    }
  } catch (error) {
    console.error("An error occurred in the worker:", error);
    console.log("error from the worker", error);

    postMessage({ error: error.message });
  }
};

// Compares each word in the dictionary with the list of hashes passwords
async function dictionaryAttack(targetHashes, encryptedDictionary) {
  return encryptedDictionary.filter((encryptedWord) =>
    targetHashes.includes(encryptedWord)
  );
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
// Returns an encrypted dictonary from a hashes dictionary
async function encryptDictionary(hashedDictionary, publicKey) {
  return hashedDictionary.map((hashedWord) =>
    rsaUtils.encrypt(publicKey, hashedWord)
  );
}

// Returns a hased dictionary
async function hashDictionary(dictionary) {
  return Promise.all(dictionary.map((word) => hashSHA512(word)));
}
