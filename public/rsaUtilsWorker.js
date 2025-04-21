export function createRsaUtils(crypto) {
  const iv = crypto.enc.Utf8.parse("0000000000000000"); // 16 bytes
  return {
    generateKeyPair: () =>
      new Promise((resolve, reject) => {
        // NOTE: CryptoJS doesn't support generateKeyPair — remove or mock this
        reject(new Error("generateKeyPair is not supported in CryptoJS."));
      }),

    encrypt: (publicKey, plaintext) => {
      const encrypted = crypto.AES.encrypt(plaintext, publicKey, {
        iv,
      });
      return encrypted.ciphertext.toString(crypto.enc.Base64);
    },

    decrypt: (privateKey, encrypted) => {
      return crypto.AES.decrypt(encrypted, privateKey).toString(
        crypto.enc.Utf8
      );
    },
  };
}
