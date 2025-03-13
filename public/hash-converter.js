// Converter for creating hashes from passwords using the hash-functions.js function.
import { hashSHA512 } from "./hash-functions.js";

function convertedPassword() {
    let password = document.getElementById("password").value;
    let hashed = hashSHA512(password);
    document.getElementById("output").innerText = "Hashed Output: " + hashed;
}


