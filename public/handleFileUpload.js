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
  const allowedTypes = [".CSV"];

  for (const file of fileList) {
    const { name: fileName } = file;

    if (!allowedTypes.includes(file.type)) {
      throw new Error(
        `❌ File "${fileName}" could not be uploaded. Only images with the following types are allowed: .CSV`
      );
    } else {
      return true; // Everything is okay
    }
  }
}
