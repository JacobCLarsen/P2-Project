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
  // Function to encrypt a message using RSA encryption - returns the encrypted message
  encrypt: async function (publicKey, message) {
    return await window.crypto.subtle.encrypt(
      {
        name: algortihm,
      },
      publicKey,
      message
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
};
