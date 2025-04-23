// TODO: Implement the websocket logic directly inside of the webworker, to have the webworker send back the result directly to the server
// This worker script takes
onmessage = async (e) => {
  try {
    console.log("Message received from main script:", e.data);

    //Import the publick key
    const publicKey = await importPublicKey(e.data.encryptionKey)
    console.log("key received by worker", publicKey);
    

    // Step 1: Hash the dictionary
    const hashedDictionary = await hashDictionary(e.data.dictionary);
    console.log("worker hashed dictionary", hashDictionary);
    

    // Step 2: Encrypt each hashed word in the dictionary using the public key
    const encryptedDictionary = await encryptDictionary(
      hashedDictionary,
      publicKey
    );
    console.log("worker ecrypted dictionary", encryptedDictionary);
    

    //debug: log the two lists, to manually compare
    console.log(encryptedDictionary);
    console.log(e.data.hashes);

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
  return hashedDictionary.map((hashedWord) => encrypt(publicKey, hashedWord));
}

// Returns a hased dictionary
async function hashDictionary(dictionary) {
  return Promise.all(dictionary.map((word) => hashSHA512(word)));
}

// Encrypt a hash using the same RSA-OEAP algorithm as the owner of the task
function encrypt(publicKey, message) {
  // Encode the message so that it is ready for encryption
  const encoder = new TextEncoder();
  const encodedMessage = encoder.encode(message);

  return crypto.subtle.encrypt(
    {
      name: "RSA-OAEP",
    },
    publicKey,
    encodedMessage
  );
}

// Function to import the publickey from arraybuffer to cryptoKey format
async function importPublicKey(exportedPublicKeyBase64) {
  const exportedPublicKeyArrayBuffer = base64ToArrayBuffer(exportedPublicKeyBase64);  // Convert from base64 to ArrayBuffer

  // Import the ArrayBuffer as a CryptoKey
  const importedKey = await crypto.subtle.importKey(
    "spki",  // use same formaet as export in "handleFileUpload.js"
    exportedPublicKeyArrayBuffer,
    {
      name: "RSA-OAEP",  
      hash: "SHA-256"    
    },
    true,  
    ["encrypt"]
  );

  return importedKey; // Return key as a CryptoKey
}

// Helper function to convert base64 to arraybuffer
function base64ToArrayBuffer(base64) {
  const binaryString = window.atob(base64);  // Decode base64 string to binary string
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return bytes.buffer;  // Return as ArrayBuffer
}
