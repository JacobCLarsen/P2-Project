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
}

export function calculateHashCount(fileList) {
  for (const file of fileList) {
    const reader = new FileReader();
    reader.onload = function (event) {
      const content = event.target.result;
      const lines = content.split("\n");
      const hash_count = lines.filter((line) => line.trim() !== "").length;
      console.log(`Number of passwords: ${hash_count}`);
    };
    reader.readAsText(file);
  }
}
