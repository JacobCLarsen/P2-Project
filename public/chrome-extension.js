// Get startBtn element
const startBtn = document.getElementById("startBtn");

// Event listener for startBtn to start and stop work
startBtn.addEventListener("click", function () {
    if (startBtn.innerHTML == "Click to start working") {
        startBtn.innerHTML = "Hashing passwords ...";
    }   else {
        startBtn.innerHTML = "Click to start working";
    }
});

