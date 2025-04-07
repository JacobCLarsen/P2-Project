// Function to toggle visibility of a DOM object
export function toggleVisibility(object, displayStyle) {
  if (object.style.display === "none" || object.style.display === "") {
    object.style.display = displayStyle;
  } else {
    object.style.display = "none";
  }
}

export function uploadFiles(form) {
  const url = "https://httpbin.org/post";
  const formData = new FormData(form);

  const fetchOptions = {
    method: "post",
    body: formData,
  };

  fetch(url, fetchOptions);
}

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
  let validHashes = checkHashLengths(fileList);

  return validHashes;
}

// ----------- Helper functions------------

// Chech length of hashes
async function checkHashLengths(fileList) {
  let validHashes = [];
  for (const file of fileList) {
    const content = await file.text();
    const lines = content.split("\n");
    const validLines = lines.filter((line) => {
      const parts = line.split(",");
      const hash = parts[1]?.trim(); // Extract the hash
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
