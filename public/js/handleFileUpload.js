// TODO: Add a way to track wich user uploaded a task, to store the results in a database with their id. The user can then reference their results at a later time
// TODO: Be able to drag and drop files into a box to upload

// Function to toggle visibility of a DOM object
export function toggleVisibility(object, displayStyle) {
  if (object.style.display === "none" || object.style.display === "") {
    object.style.display = displayStyle;
  } else {
    object.style.display = "none";
  }
}
// Handle the submit and add the task to the queue
export async function submitFileUpload(fileList, user_id) {
  // Validate the files again to make sure nothing as changed since the user uploaded their files
  await validateFileUpload(fileList)
    .then(async (hashes) => {
      // Clean hashes before upload
      const cleanedHashes = await cleanHashes(hashes);
      // Upload the hashes to the database
      console.log("uploading hashes", cleanedHashes);
      uploadFiles(cleanedHashes, user_id);
    })
    .catch((err) => {
      console.log("error - ", err);

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
        `❌ File "${fileName}" could not be uploaded. Only files with the following types are allowed: .csv`
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

// Removed defects and dublicates from the hashes
async function cleanHashes(hashes) {
  // Clean hashes to prevent "\r" or any other defects
  const cleanedHashes = hashes.map((hash) =>
    hash.replace(/[\r\n]+/g, "").trim()
  );
  // Remove duplicate hashes by creating a set
  const uniqueHashes = [...new Set(cleanedHashes)];

  return uniqueHashes;
}

// Upload files
async function uploadFiles(hashes, user_id) {
  console.log("Hashes to upload:", hashes); // Debug log to verify the array

  // Check if hashes has been parsed into the correct format
  if (!Array.isArray(hashes)) {
    throw new Error("Hashes must be an array");
  }

  // Send a post request to the "startwork" endpoint - received and handled in "router.js"
  await fetch("startwork", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ hashes, user_id }),
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
