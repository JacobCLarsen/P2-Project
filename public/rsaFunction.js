// Define the crypto function
const JSEncrypt = window.JSEncrypt;
const encryptor = new JSEncrypt();

// Test keys for testing
export const publicKey =
  "-----BEGIN PUBLIC KEY-----MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA7wW0P2ch7t4dPBnmEkVzPkjO+okYFzPEhX9lqxW9hRvdJ22ceH1sF9+uJdVYMId3ZG70V0lD2A27mUJ/Z0eSmG0OvcRydq9oJd7aUOwiqUOdSKsQtIX1pI5AF7jqcpY4WFXSnbTgGV4cHRi9yhm5jxuCwFVnKO4lfWlneTxjl+N2DrUP6Evj2Tg0iD2kA8wHYObfnGIf47Txk6A5AVh2yUAtnW5EwVGpkvAlYySHYEMym+Fc3xlFgTLErKTrtbn99VhZyQ0KLXNOpxSOfDTwQ9PESyqJ0bO2v3rTw1u0wYwhcfmuS+kbLFALApO9IklQFu2wM0lYO8prwCpCm7bfIQIDAQAB-----END PUBLIC KEY-----";
encryptor.setPublicKey(publicKey);

export { encryptor };

/*
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
*/
