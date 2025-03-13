import { hashSHA512 } from "./hash-functions.js";

console.log(typeof hashSHA512);

async function convertedPassword() {
    let password = document.getElementById("password").value;
    let hashed = await hashSHA512(password);
   
    let output = document.getElementById("output-box");
    output.style.display = "block";

    document.getElementById("output").innerText = "Hashed Output: " + hashed;
}

document.querySelector(".btn").addEventListener("click", convertedPassword);

// Copy to clipboard button
document.getElementById("copy-btn").addEventListener("click", function () {
    let hashText = document.getElementById("output").innerText;
    navigator.clipboard.writeText(hashText)
});
