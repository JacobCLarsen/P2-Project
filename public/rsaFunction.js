// Define the crypto function
const crypto = window.CryptoJS;

// Test keys for testing
export const publicKey =
  "-----BEGIN PUBLIC KEY-----MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA7a9fZV6F5mpzT+jgnStZ6lVjP6Wj8X9c8r16pF+zbgzjmbN5Q/sVXlk5PAvmSTfs2po6Sx7tOBa1LfjyUEUlHUl2b6D6I4lV7M8vvS/fuG1B2SH3fVgZyC5jrTL/sDtrCS4lf64fhKl2zS5Tkc6qHiw+7pYFosqjMY5PS0XsBvqOVqmfec9KHc1h1mIjS5J0F7Vh48Wh3MfJ04lZZvPzIq5r1/NQ5pFOPRmJw6QjMmXghmJMjk7icn0wr5t3Xkn/jFlA+LFh2Rvhk3/FdZxL3TZwSmxZ2JcmGj+VxNlZcmmlNOtr2E5+YZZnC3DkCAaBN7FhR94pNxZP3zVhb4WqfwIDAQAB-----END PUBLIC KEY-----";
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
    let encrypted = crypto.AES.encrypt(
      Buffer.from(plaintext),
      publicKey
    ).toString();
    console.log(encrypted);
  },

  // Decrypt Data with Private Key
  decrypt: (privateKey, encrypted) => {
    let decrypted = crypto.AES.decrypt(encrypted, privateKey).toString();
    console.log(decrypted);
  },
};
