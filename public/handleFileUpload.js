// TODO: Add a way to track wich user uploaded a task, to store the results in a database with their id. The user can then reference their results at a later time
// TODO: Discard dublicates from the hashes
// TODO: Encrypt hashes
// TODO: Be able to drag and drop files into a box to upload

import { rsaUtils } from "./rsaFunction.js";

// Function to toggle visibility of a DOM object
export function toggleVisibility(object, displayStyle) {
  if (object.style.display === "none" || object.style.display === "") {
    object.style.display = displayStyle;
  } else {
    object.style.display = "none";
  }
}
// Handle the submit and add the task to the queue
export async function submitFileUpload(fileList) {
  // Validate the files again to make sure nothing as changed since the user uploaded their files
  await validateFileUpload(fileList)
    .then((hashes) => {
      // Encrypt hashes
      const encrypted = hashEncrypt(hashes);
      console.log("Hashes encrypted");
      return encrypted;
    })
    .then((encryptedHashes) => {
      // Upload the hashes to the database
      console.log("uploading encrypted hashes", encryptedHashes);
      uploadFiles(encryptedHashes);
    })
    .catch(() => {
      throw new Error("Invalid file upload");
    });
}

// Validate the file type and hash length of the uploaded file(s)
export async function validateFileUpload(fileList) {
  const allowedTypes = ["text/csv"];

  // Check each file if they are the right filetype
  for (const file of fileList) {
    const { name: fileName } = file;
    if (!allowedTypes.includes(file.type)) {
      throw new Error(
        `❌ File "${fileName}" could not be uploaded. Only images with the following types are allowed: .csv`
      );
    }
  }

  // Check if the hashes are 512 bits (corresponding to the SHA1-512), return valid hashes
  let validHashes = await checkHashLengths(fileList).catch(() => {
    throw new Error("Invalid hash length");
  });

  return validHashes;
}

// ----------- Helper functions------------
// Upload files
async function uploadFiles(hashes) {
  console.log("Hashes to upload:", hashes); // Debug log to verify the array

  if (!Array.isArray(hashes)) {
    throw new Error("Hashes must be an array");
  }

  await fetch("startwork", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ hashes: hashes }),
  })
    .then((response) => {
      console.log(response);

      if (!response.ok) {
        throw new Error("Failed to upload hashes");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Server response:", data);
    })
    .catch((error) => {
      console.error("Error uploading hashes:", error);
    });
}

// Encrypt hashes
async function hashEncrypt(hashes) {
  console.log("public key", rsaUtils.publicKey);

  let encryptedHashes = [];
  hashes.forEach((hash) => {
    encryptedHashes.push(rsaUtils.encrypt(hash, rsaUtils.publicKey));
  });

  return encryptedHashes;
}

// Chech length of hashes
async function checkHashLengths(fileList) {
  let validHashes = [];
  for (const file of fileList) {
    const content = await file.text();
    const hashes = content.split("\n");
    validHashes.push(...hashes.filter((hash) => hash.trim().length === 128));
    console.log(`File: ${file.name} contains ${validHashes.length} hashes`);
  }

  // Filter for hashes using the specificied length of 128 characters
  console.log("Total 512 bit hashes found:", validHashes.length);

  // If any 512 bit hashes in the array
  if (validHashes.length > 0) {
    return validHashes;
  } else {
    // Else return false to show an error
    throw new Error("No valid 512 bit hashes found");
  }
}

// Chech length of hashes, when the user has also specified usernames for each hash
async function checkHashLengthUsername(fileList) {
  let validHashes = [];
  for (const file of fileList) {
    const content = await file.text();
    const lines = content.split("\n");
    const validLines = lines.filter((line) => {
      const parts = line.split(",");
      const hash = parts[1]?.trim(); // Extract the hash from the line
      if (hash.length === 128) {
        validHashes.push(hash);
      } else {
        throw new Error(
          `hash in ${file}, hash ${hash} has length ${hash.length}`
        );
      }
    });
    console.log(
      `File: ${file.name}. Total lines: ${lines.length}, valid 512-bit hashes: ${validHashes.length}`
    );
  }

  // If any hashes in the array
  if (validHashes.length > 0) {
    return validHashes;
  } else {
    // Else return false to show an error
    return false;
  }
}
