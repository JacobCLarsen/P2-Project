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
};

// Keys for tesing
export const publickKey =
  "-----BEGIN PUBLIC KEY-----MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAuF+RJZHo7+JLxY896ToQ6c8ykz/ocJwNH9DgwXK/sdP/Zbis8be5hNReAL3sXSWtQM2rvOsytMKpHlwaHidXra9b8juhWNO7QrbIIc3wnNbAwWrylK/BcYGz//daajt5mz92xLue83sM9rVtDQiSTS76mmdZRlMVqN9uupMkW0EToAfpJ2dYNvbXRPfXdfbYwH0VHWzK5VDrpDA/LivfwoUpt5Wzk+oNdBfD0eKu3rYE/hTMiAaAv4fY8KUZb4lcL5QDmd0enNC9qRr7CV5XC8dR8ZwKJLPmOKwx+JNUNNj+WffGtiDD94RRPtY22lPXxaRoOZECA7f7SwJQl+UTtwIDAQAB-----END PUBLIC KEY-----";

export const privateKey =
  "-----BEGIN PRIVATE KEY-----MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC4X5Elkejv4kvFjz3pOhDpzzKTP+hwnA0f0ODBcr+x0/9luKzxt7mE1F4AvexdJa1Azau86zK0wqkeXBoeJ1etr1vyO6FY07tCtsghzfCc1sDBavKUr8FxgbP/91pqO3mbP3bEu57zewz2tW0NCJJNLvqaZ1lGUxWo3266kyRbQROgB+knZ1g29tdE99d19tjAfRUdbMrlUOukMD8uK9/ChSm3lbOT6g10F8PR4q7etgT+FMyIBoC/h9jwpRlviVwvlAOZ3R6c0L2pGvsJXlcLx1HxnAoks+Y4rDH4k1Q02P5Z98a2IMP3hFE+1jbaU9fFpGg5kQIDt/tLAlCX5RO3AgMBAAECggEAERlb3r4fek/kcxgLx9uIwgZjTGC67+apGPBIR+iaeqWMpCRydaByZi1D4pG6oBDkdoQcj1LIyxbalGQ6T92aNhNzVY3OMuzACznkaa4tyH3qNoXypXN/X0WGKhEIo52Mc6d5HlnALhiVZTQCPxkyaFIZD8TR9MGz2ouOO2N2FbhVB9pBfUUEJCrWgtPbWUqrXM4pudNvBZ6iATL/kROvOGfEuPpUqX9rIgeDyh+cctOw+QlIyiA2wzduVQJbzYlTBylJ5Lw9aqHKrs8dfjnRJz71wXwjjJGAi0zCAMN4c6BBpcN4yuYdhfmnwbZzA8OAB76pLmocXJ/JTLl+ldrO0QKBgQDfCW6UBdkT9Vy/O0LzVX+RZBVMpG4hu2fHYmc7B79jTLC9xuSwJNcA+MBSedM8Smltk0tJU42usHlkVDDWS3zlrKmF6tZVoKdpCpdcWWZ+BJ3Vr4EEhkKnyj+FoX+q8LX83PnjFV696h52+/CXrj1Yvk6C2DDGJHrPwG+UirXd8wKBgQDTn044QeHFgxkYudVQvurTeKUrnxsY/NuYWCZ9B18UbBnJVDd5CaXvBYyaze9UJp139zOTZ09A8Lj5A96e9wSa4cFBB/n5eDGHz4ye4jQFH8E9kPT8qO2IW9ZWWmJfbWI3EBvaxG/KEiZZJpWQlwx7BFurYRGbXgLhY9/XdNKwLQKBgQDP7hEi+pi4HKUMuwjdpjW5q96XhywNUpObtEedJsnsn1CefFAzTwUKqN1ThrPBn3XOa+ViRPzvgSKKwFqPTezwihm4+Yg8Z/vq167or4f3sAIddvMG7swxdUHnKPrGuIZRaQmmBQRAdYVVU+em4Q/cLf8vyLEf6F5+VF8x0mdetQKBgGdD2XuCSpWC/4AdToZ0Y0qGGLNMlICBAvc4LK/eJPtmNL8VpWwe1SXp4063Jw49OaIMstI/G2FpFhoNVVjk2Q5rE06UgdrGWAUZtljhsNi/QiC015djJ2XeypygxlginEaaSb1bFeHZMXVXaqx/yMtOuRzL5TeXjHhHsDcG/riRAoGBAKF/awLPZalHf/ZCXPyyjUQPStKP36c8BHjQBnuAPEyvgaHn/eWjK9d44z2M3HgTc0xaJ+CSZFhdF+28/gYVItemMfMcSVm/n6hg/X4zvmr+xgG8x/t2raFzf0yMEPunr5JiPV4bWSTa7lxr7AvXu6OkGkltWUkdF/X3A7vGSVgU-----END PRIVATE KEY-----";
