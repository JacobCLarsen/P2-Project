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

  // Check if the hashes are 512 bits (corresponding to the SHA1-512)
  checkHashLengths(fileList);

  // If no error:
  return true; // Everything is okay
}

export async function calculateHashCount(fileList) {
  let totalHashCount = 0;

  for (const file of fileList) {
    const content = await file.text();
    const lines = content.split("\n");
    totalHashCount += lines.filter((line) => line.trim() !== "").length;
  }

  console.log(`Number of hashes in file(s): ${totalHashCount}`);
  return totalHashCount;
}

// ----------- Helper functions------------

// Chech length of hashes
async function checkHashLengths(fileList) {
  for (const file of fileList) {
    const content = await file.text();
    const lines = content.split("\n");
    const validHashes = lines.filter((line) => {
      const parts = line.split(",");
      const hash = parts[1]?.trim(); // Extract the hash
      return hash && hash.length === 128; // Check if hash is 512 bit/ 128 characters
    });

    if (lines.length > validHashes.length) {
      throw new Error(
        `Not all lines had a valid 512-bit hash. Please check the content of file: ${file.name}. Total lines: ${lines.length}, valid 512-bit hashes: ${validHashes.length}`
      );
    } else {
      console.log(
        `File: ${file.name}. Total lines: ${lines.length}, valid 512-bit hashes: ${validHashes.length}`
      );
    }
  }
}
