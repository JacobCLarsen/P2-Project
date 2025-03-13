// Imports the function hashSHA512 from the file hash.js and the file system module.
import { hashSHA512 } from './hash-functions.js';
import fs from 'fs';

// Function for comparing dictionary with the target hashed password.
async function dictionaryAttack(targetHash, filePath) {

    // Reads the file and returns as a string. utf8 is the type of character encoding used in the file.
    const data = fs.readFileSync(filePath, 'utf8');

    // data.split splits const data into array of lines. password.trim removes extra spaces ad empty lines.
    const passwords = data.split('\n').map(password => password.trim());

    // "For of" loop that goes through each password of the dictionary.
    for (let password of passwords) {

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

// Const for the dictionary.txt file and the target hash.
const filePath = "./public/dictionary.txt";
const targetHash = prompt("Insert the hash you wish to look for: ");

// Calls the function.
dictionaryAttack(targetHash, filePath);

