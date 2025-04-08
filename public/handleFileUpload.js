// TODO: Add a way to track wich user uploaded a task, to store the results in a database with their id. The user can then reference their results at a later time
// TODO: Discard dublicates from the hashes

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
      // Upload the hashes to the database
      console.log("uploading hashes", hashes);
      uploadFiles(hashes);
    })
    .catch(() => {
      throw new Error("Invalid file upload");
    });
}

// Validate the file type and hash length of the uploaded file(s)
export async function validateFileUpload(fileList) {
  const allowedTypes = ["text/csv"];
  let validHashes = [];

  for (const file of fileList) {
    const { name: fileName } = file;
    if (!allowedTypes.includes(file.type)) {
      throw new Error(
        `❌ File "${fileName}" could not be uploaded. Only files with the following types are allowed: .csv`
      );
    }

    const content = await file.text();
    const hashes = content.split("\n").map((line) => line.trim());
    validHashes.push(...hashes.filter((hash) => hash.length === 128));
  }

  console.log("Validated hashes:", validHashes); // Debug log to verify the array
  return validHashes;
}

// ----------- Helper functions------------
// Upload files
async function uploadFiles(hashes) {
  await fetch("startwork", {oad:", hashes); // Debug log to verify the array
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ hashes: hashes }),);
  })
    .then((response) => {
      if (!response.ok) {, {
        throw new Error("Failed to upload hashes");
      }ders: { "Content-Type": "application/json" },
      return response.json();shes: hashes }),
    })
    .then((data) => {=> {
      console.log("Server response:", data);
    })  throw new Error("Failed to upload hashes");
    .catch((error) => {
      console.error("Error uploading hashes:", error);
    });
}   .then((data) => {
      console.log("Server response:", data);
// Chech length of hashes
async function checkHashLengths(fileList) {
  let validHashes = [];ror uploading hashes:", error);
  for (const file of fileList) {
    const content = await file.text();
    const hashes = content.split("\n");
    validHashes.push(...hashes.filter((hash) => hash.trim().length === 128));
    console.log(`File: ${file.name} contains ${validHashes.length} hashes`);
  }et validHashes = [];
  for (const file of fileList) {
  // Filter for hashes using the specificied length of 128 characters
  console.log("Total 512 bit hashes found:", validHashes.length);
    validHashes.push(...hashes.filter((hash) => hash.trim().length === 128));
  // If any 512 bit hashes in the arraytains ${validHashes.length} hashes`);
  if (validHashes.length > 0) {
    return validHashes;
  } else {r for hashes using the specificied length of 128 characters
    // Else return false to show an error:", validHashes.length);
    throw new Error("No valid 512 bit hashes found");
  }/ If any 512 bit hashes in the array
} if (validHashes.length > 0) {
    return validHashes;
// Chech length of hashes, when the user has also specified usernames for each hash
async function checkHashLengthUsername(fileList) {
  let validHashes = []; valid 512 bit hashes found");
  for (const file of fileList) {
    const content = await file.text();
    const lines = content.split("\n");
    const validLines = lines.filter((line) => {so specified usernames for each hash
      const parts = line.split(",");me(fileList) {
      const hash = parts[1]?.trim(); // Extract the hash from the line
      if (hash.length === 128) {
        validHashes.push(hash);text();
      } else {s = content.split("\n");
        throw new Error(ines.filter((line) => {
          `hash in ${file}, hash ${hash} has length ${hash.length}`
        );t hash = parts[1]?.trim(); // Extract the hash from the line
      }f (hash.length === 128) {
    }); validHashes.push(hash);
    console.log(
      `File: ${file.name}. Total lines: ${lines.length}, valid 512-bit hashes: ${validHashes.length}`
    );    `hash in ${file}, hash ${hash} has length ${hash.length}`
  }     );
      }
  // If any hashes in the array
  if (validHashes.length > 0) {
    return validHashes;e}. Total lines: ${lines.length}, valid 512-bit hashes: ${validHashes.length}`
  } else {
    // Else return false to show an error
    return false;
  }/ If any hashes in the array
} if (validHashes.length > 0) {
    return validHashes;
  } else {
    // Else return false to show an error
    return false;
  }
}
