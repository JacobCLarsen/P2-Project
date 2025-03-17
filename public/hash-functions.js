// SHA-512 hash function for hashing passwords.
// The function hashSHA512 takes a message as input and returns a SHA-512 hash of the message.
async function hashSHA512(message) {
    // Converts string into binary format
    const encoder = new TextEncoder();
    // Transfors the text into bytes 
    const data = encoder.encode(message);
    // Computes the SHA-512 hash of the input
    const hashBuffer = await crypto.subtle.digest("SHA-512", data);
    // Converts hashBuffer to hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    // Converts each byte into hexadecimal
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
    return hashHex;
}

export { hashSHA512 };