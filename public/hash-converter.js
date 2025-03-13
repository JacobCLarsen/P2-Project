import { hashSHA512 } from "./hash-functions.js";

console.log(typeof hashSHA512);

async function convertedPassword() {
    let password = document.getElementById("password").value;
    let hashed = await hashSHA512(password);
    let output = document.getElementById("output");

    output.style.display = "block";
    document.getElementById("output").innerText = "Hashed Output: " + hashed;
}

document.querySelector(".btn").addEventListener("click", convertedPassword);