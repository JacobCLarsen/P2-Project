// Convert for creating hashes from passwords
import { hashSHA512 } from "./hash-functions.js";

function converter512() {
    const password = prompt("Insert the password you wish to hash: ");
    const hashedPassword = hashSHA512(password);
    console.log(hashedPassword);
}