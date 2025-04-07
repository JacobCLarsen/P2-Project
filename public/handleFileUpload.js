// Function to toggle visibility of a DOM object
export function toggleVisibility(object, displayStyle) {
  if (object.style.display === "none") {
    object.style.display = displayStyle;
  } else {
    object.style.display = "none";
  }
}
