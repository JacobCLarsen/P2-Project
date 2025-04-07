// Function to toggle visibility of a DOM object
export function toggleVisibility(object, displayStyle) {
  if (object.style.display != "none") {
    object.style.display = "none";
  } else {
    object.style.display = displayStyle;
  }
}
