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

export function validateFileUpload(fileList) {
  const allowedTypes = ["text/csv"];

  // Check each file if they are the right filetype
  for (const file of fileList) {
    const { name: fileName } = file;
    if (!allowedTypes.includes(file.type)) {
      throw new Error(
        `❌ File "${fileName}" could not be uploaded. Only images with the following types are allowed: .csv`
      );
    } else {
      return true; // Everything is okay
    }
  }

  // Check if the hashes are 512 bits (corresponding to the SHA1-512)
  chechHashLengths(fileList);
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
async function chechHashLengths(fileList) {
  for (const file of fileList) {
    const content = await file.text();
    const lines = content.split("\n");
    const hashes = lines.split(",");
    const validHashes = hashes.filter((hash) => hash.trim().length === 128);

    if (lines.length > validHashes.length) {
      throw new Error(
        `Not all lines had a valied 512 bit hash, please check content of file: ${file} lines: ${lines.length}, valied 512 bit hashes: ${validHashes.length}`
      );
    } else {
      console.log(
        `File: ${file} lines: ${lines.length}, valied 512 bit hashes: ${validHashes.length}`
      );
    }
  }
}
