export function createRsaUtils(crypto) {
    return {
      generateKeyPair: () =>
        new Promise((resolve, reject) => {
          // NOTE: CryptoJS doesn't support generateKeyPair — remove or mock this
          reject(new Error("generateKeyPair is not supported in CryptoJS."));
        }),
  
      encrypt: (publicKey, plaintext) => {
        return crypto.AES.encrypt(plaintext, publicKey).toString();
      },
  
      decrypt: (privateKey, encrypted) => {
        return crypto.AES.decrypt(encrypted, privateKey).toString(crypto.enc.Utf8);
      },
    };
  }