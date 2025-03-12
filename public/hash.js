//Import the built-in crypto module in Node.js, which provides
//cryptographic functionalities, including has functions:
const crypto = require("crypto");


//Function to generate SHA-512 hash for a given input string:
function hashSHA512(input) {
    return crypto.createHash('sha512').update(input).digest('hex');
    // - .createHash("sha512"): Create a SHA-512 hash instance.
    // - .update(input): Feed the input string into the hash function.
    // - .digest("hex"): Compute the final hash and return it as a
    //                   hexadecimal string.
}

//Define an input string:
const input = "ABCD1234!";

//Print the input and its SHA-512 hash:
console.log("Input:", input);
console.log("SHA-512 Hash:", hashSHA512(input));
