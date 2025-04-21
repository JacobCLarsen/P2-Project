// Define the crypto function
const crypto = window.CryptoJS;

// Test keys for testing
export const publicKey = "1234567890abcdef";
export const privateKey = "abcd1234";
const iv = crypto.enc.Utf8.parse("0000000000000000"); // 16 bytes

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
    const encrypted = crypto.AES.encrypt(plaintext, publicKey, {
      iv,
    });
    return encrypted.ciphertext.toString(crypto.enc.Base64);
  },

  // Decrypt Data with Private Key
  decrypt: (privateKey, encrypted) => {
    return crypto.AES.decrypt(encrypted, privateKey).toString();
  },
};
