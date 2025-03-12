//Import the built-in crypto module in Node.js.
import { createHash } from "crypto";

//Function to generate SHA-512 hash for a given input string.
export function hashSHA512(input) {
    return createHash('sha512').update(input).digest('hex');
}

// createHash("sha512"): Create a SHA-512 hash instance.
// update(input): Feed the input string into the hash function.
// digest("hex"): Compute the final hash and return it as a hexadecimal string.