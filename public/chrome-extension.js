// Get startBtn element
const startBtn = document.getElementById("startBtn");
// Event listener for startBtn to start and stop work
startBtn.addEventListener("click", function () {
    if (startBtn.innerHTML === "Click to start working") {
        startBtn.innerHTML = "Hashing passwords ...";
        startBtn.style.color = "green";
        startBtn.style.border = "2px solid green";
    } else {
        startBtn.innerHTML = "Click to start working";
        startBtn.style.color = "";
        startBtn.style.border = "";
    }
});