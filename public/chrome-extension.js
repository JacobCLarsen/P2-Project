// Get startBtn element
const startBtn = document.getElementById("startBtn");
const dots = document.getElementById("dots");

// Event listener for startBtn to start and stop work
startBtn.addEventListener("click", function () {
    if (startBtn.innerHTML == "Click to start working") {
        startBtn.innerHTML = "Hashing passwords ...";
        startBtn.style.color = "green";
        startBtn.style.border = "2px solid green";
    }   else {
        startBtn.innerHTML = "Click to start working";
    }
});

function dotsAnimation(){
let dots = "";
  const interval = setInterval(() => {
    if (startBtnText.innerText !== "Hashing hashes") {
      clearInterval(interval);
      startBtnLoad.innerText = "";
      return;
    }
    dots = dots.length < 4 ? dots + "." : ".";
    startBtnLoad.innerText = dots;
  }, 600);
}