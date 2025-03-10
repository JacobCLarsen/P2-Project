
//Import the built-in crypto module in Node.js, which provides 
//cryptographic functionalities, including has functions:
const crypto = require("crypto");;

//Function to generate SHA-256 hash for a given input string:
function hashSHA256(input) {
    return crypto.createHash('sha256').update(input).digest('hex');
    // - .createHash("sha256"): Create a SHA-256 hash instance.
    // - .update(input): Feed the input string into the hash function.
    // - .digest("hex"): Compute the final hash and return it as a
    //                   hexadecimal string.
}

//Define an input string:
const input = "ABCD1234!";

//Print the input and its SHA-256 hash:
console.log("Input:", input);
console.log("SHA-256 Hash:", hashSHA256(input));

