/*
This file contains the functions for encrypting and decrypting messages in the brower
As Web workers do not have access to the "window" object, we have a speciel implementtations for encrypting in a webworker, 
inside of the "worker.js" file. 

For browser use, SubtleCrypto function are available inside of the "window.crypto" property
*/

// Specify the encryption algortihm used is RSA-OAEP
const algortihm = "RSA-OAEP";

// rsaUtils is exported and holds function to encrypt and decrypt a message using RSA-OAEP
export const rsaUtils = {
  // Encode message into the right format for encryption
  EncodeMessage: function (message) {
    let enc = new TextEncoder();
    return enc.encode(message);
  },

  // Function to encrypt a message using RSA encryption - returns the encrypted message
  encrypt: async function (publicKey, message) {
    let encodedMessage = rsaUtils.EncodeMessage(message);
    return await window.crypto.subtle.encrypt(
      {
        name: algortihm,
      },
      publicKey,
      encodedMessage
    );
  },

  // Function to decrypt a message using RSA encryption - returns a promise for the encrypted message
  decryptMessage: async function (key, ciphertext) {
    return await window.crypto.subtle.decrypt(
      {
        name: algortihm,
      },
      key,
      ciphertext
    );
  },

  // Generate a keypair of a public and private key
  generateKeyPair: async function () {
    return window.crypto.subtle.generateKey(
      {
        name: algortihm,
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256",
      },
      true,
      ["encrypt", "decrypt"]
    );
  },

  //Export a keys to base 64
  exportPublicKey: async function (publicKey) {
    const exportedKey = await crypto.subtle.exportKey("spki", publicKey); // Export to SPKI format
    return rsaUtils.arrayBufferToBase64(exportedKey); // This is now in base64
  },

  // We also need a function to import the key from an array buffer into the cryptoKey format
  importPublicKey: async function (exportedPublicKey) {
    const importedKey = await crypto.subtle.importKey(
      "spki", //Use same format is the export function
      exportedPublicKey,
      {
        name: "RSA-OAEP", // Algorithm to use with the key
        hash: "SHA-256", // Hash algorithm (or the one used in key generation)
      },
      true,
      ["encrypt"] // Usage of the key
    );
    return importedKey;
  },

  // Helper function to convert arraybuffer to base64
  arrayBufferToBase64: function (buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary); // Convert to base64
  }
};

