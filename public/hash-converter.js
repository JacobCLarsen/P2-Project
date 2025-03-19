import { hashSHA512 } from "./hash-functions.js";

const copyBtn = document.getElementById("copy-btn");

// Function converting password to hash using the hashSHA512 function.
async function convertedPassword() {
    let password = document.getElementById("password").value;
    let hashed = await hashSHA512(password);
    let output = document.getElementById("output-box");

    // Makes the grey output box appear only after the password is hashed.
    output.style.display = "block";
    
    document.getElementById("output").innerText = "Hashed Output: " + hashed;
}

// Executes convertedPassword function when button "btn" is pressed.
document.querySelector(".btn").addEventListener("click", convertedPassword);


// Copy to clipboard function
copyBtn.addEventListener("click", function () {
    // Gets element from the id "output" and excludes the "Hashed Output: " part.
    let hashText = document.getElementById("output").innerText.replace("Hashed Output: ", "");
    // Copies the elemtent to system clipboard.
    navigator.clipboard.writeText(hashText);

    // Changes the button text to "Copied!" when the button is clicked.
    if (copyBtn.innerHTML == "Copy") {
        copyBtn.innerHTML = "Copied!";
    }
});



