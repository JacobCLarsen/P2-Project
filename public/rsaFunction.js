//Test keys for testing
import { Buffer } from "buffer";

export const publicKey = "123456789";
export const privateKey = "abcd1234";

export const rsaUtils = {
  // Generate a pair of private/ public keys
  generateKeyPair: () =>
    new Promise((resolve, reject) => {
      crypto.generateKeyPair(
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
  encrypt: (publicKey, plaintext) =>
    crypto.publicEncrypt(publicKey, Buffer.from(plaintext)),

  // Decrypt Data with Private Key
  decrypt: (privateKey, encrypted) =>
    crypto.privateDecrypt(privateKey, encrypted),
};
