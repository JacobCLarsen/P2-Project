// Define the crypto function
const crypto = window.CryptoJS;

// Test keys for testing
export const publicKey = "1234567890abcdef";
export const privateKey = "abcd1234";

export const rsaUtils = {
  // Generate a pair of private/public keys
  generateKeyPair: () =>
    new Promise((resolve, reject) => {
      crypto.AES.generateKeyPair(
        "rsa",
        {
          modulusLength: 2048, // Key length
          publicKeyEncoding: { type: "spki", format: "pem" }, // Public key encoding
          privateKeyEncoding: { type: "pkcs8", format: "pem" }, // Private key encoding
        },
        (err, publicKey, privateKey) => {
          if (err) {
            reject(err);
          } else {
            console.log(
              `Generated keys - Public: ${publicKey}, Private: ${privateKey}`
            );
            resolve({ publicKey, privateKey });
          }
        }
      );
    }),

  // Encrypt Data with Public Key
  encrypt: (publicKey, plaintext) => {
    let encrypted = crypto.AES.encrypt(plaintext, publicKey).toString();
    console.log(encrypted);
  },

  // Decrypt Data with Private Key
  decrypt: (privateKey, encrypted) => {
    let decrypted = crypto.AES.decrypt(encrypted, privateKey).toString();
    console.log(decrypted);
  },
};
