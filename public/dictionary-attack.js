// Imports the function hashSHA512 from the file hash.js.
import { hashSHA512 } from './hash-functions.js';

// Function for comparing dictionary with the target hashed password.
async function dictionaryAttack(targetHash, dictionary) {

    // "For of" loop that goes through each password of the dictionary.
    for (let password of dictionary) {

        // Hashes the current password and assigns it to the const hashedPassword.
        const hashedPassword = await hashSHA512(password);

        // If hashedPassword is equal to the target hashed password, then returns correct password.
        if (hashedPassword === targetHash) {
            console.log(`password found: ${password}`);
            return password;
        }
    }
    // Prints if password is not contained in the dictionary.
    console.log("Password not found in dictionary.");
    return null;
}

// Temporary const for proof of concept.
const dictionary = ["123","1234","123456","12345","1234567"];
const targetHash = "ba3253876aed6bc22d4a6ff53d8406c6ad864195ed144ab5c87621b6c233b548baeae6956df346ec8c17f5ea10f35ee3cbc514797ed7ddd3145464e2a0bab413";

// Calls the function.
dictionaryAttack(targetHash, dictionary);

