// Toggle visibility of a DOM object
export function toggleVisibility(object, displayStyle) {
  if (object.style.display === "none" || object.style.display === "") {
    object.style.display = displayStyle;
  } else {
    object.style.display = "none";
  }
}

// Handle the submit and add the task to the queue
export async function submitFileUpload(fileList, user_id) {
  try {
    // Validate the files again to make sure nothing has changed
    const { validHashes } = await validateFileUpload(fileList);

    // Clean hashes before upload
    const cleanedHashes = await cleanHashes(validHashes);

    // Upload the hashes to the database
    await uploadFiles(cleanedHashes, user_id);
    console.log("Uploaded hashes")
  } catch (err) {
    console.error("Error:", err);
    throw new Error("Invalid file upload");
  }
}

// Validate the file type and hash length of the uploaded file(s)
export async function validateFileUpload(fileList) {
  const allowedTypes = ["text/csv"];

  // Check each file if they are the correct filetype
  for (const file of fileList) {
    const { name: fileName } = file;
    if (!allowedTypes.includes(file.type)) {
      throw new Error(
        `❌ File "${fileName}" could not be uploaded. Only .csv files are allowed.`
      );
    }
  }

  // Check hash lengths and characters
  const { validHashes, invalidHashes } = await checkHashLengths(fileList).catch(
    () => {
      throw new Error(
        "This file contains no valid 512-bit hexadecimal hashes."
      );
    }
  );

  return { validHashes, invalidHashes };
}

// ----------- Helper functions ------------

// Remove defects and duplicates from the hashes
async function cleanHashes(hashes) {
  const cleanedHashes = hashes.map((hash) =>
    hash.replace(/[\r\n]+/g, "").trim()
  );
  const uniqueHashes = [...new Set(cleanedHashes)];
  return uniqueHashes;
}

// Upload files
async function uploadFiles(hashes, user_id) {
  if (!Array.isArray(hashes)) {
    throw new Error("Hashes must be an array");
  }

  try {
    const response = await fetch("startwork", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hashes, user_id }),
    });

    if (!response.ok) {
      throw new Error("Failed to upload hashes");
    }

    const data = await response.json();
    console.log("Server response:", data);
  } catch (error) {
    console.error("Error uploading hashes:", error);
    throw error;
  }
}

// Check length and validity of hashes
async function checkHashLengths(fileList) {
  let validHashes = [];
  let allInvalidHashes = [];

  for (const file of fileList) {
    const content = await file.text();
    const hashes = content.split(/\r?\n/);

    let fileValidHashes = [];
    let fileInvalidLength = [];
    let fileInvalidHex = [];

    hashes.forEach((rawHash) => {
      const hash = rawHash.trim();
      if (hash.length === 128) {
        if (/^[a-fA-F0-9]+$/.test(hash)) {
          fileValidHashes.push(hash);
        } else {
          fileInvalidHex.push(hash);
        }
      } else if (hash !== "") {
        fileInvalidLength.push(hash);
      }
    });

    console.log(
      `File: ${file.name} contains ${fileValidHashes.length} valid hashes`
    );
    console.log(
      `File: ${file.name} contains ${fileInvalidLength.length} hashes with incorrect length`
    );
    console.log(
      `File: ${file.name} contains ${fileInvalidHex.length} hashes with non-hex characters`
    );

    validHashes = validHashes.concat(fileValidHashes);
    allInvalidHashes = allInvalidHashes.concat(
      fileInvalidLength,
      fileInvalidHex
    );
  }

  if (allInvalidHashes.length > 0){
    console.log(`Invalid hashes: ${allInvalidHashes}`);
    
  }

  if (validHashes.length > 0) {
    return { validHashes, invalidHashes: allInvalidHashes };
  } else {
    throw new Error("No valid 512-bit hexadecimal hashes found");
  }
}
