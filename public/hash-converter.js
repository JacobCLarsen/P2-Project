// Converter for creating hashes from passwords using the hash-functions.js function.
import { hashSHA512 } from "./hash-functions.js";

function converter512() {
    const password = prompt("Insert the password you wish to hash: ");
    const hashedPassword = hashSHA512(password);
    return hashedPassword;
}