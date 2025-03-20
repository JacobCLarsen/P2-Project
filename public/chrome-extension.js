// Get startBtn element
const startBtn = document.getElementById("startBtn");
// Event listener for startBtn to start and stop work
const port = chrome.runtime.connect({ name: "popup" });
const mySocket = new WebSocket("wss://cs-25-sw-2-01.p2datsw.cs.aau.dk/ws1/");

mySocket.addEventListener("open", (event) => {
    let message = {
      action: "connect",
      data: null,
      id: "extension", // Use the generated client ID
    };
    
    mySocket.send(JSON.stringify(message));
});

startBtn.addEventListener("click", function() {
    if (startBtn.innerHTML === "Click to start working") {
        port.postMessage({ action: "startTask" });

        startBtn.innerHTML = "Hashing passwords ...";
        startBtn.style.color = "green";
        startBtn.style.border = "green 2px solid";
        startBtn.addEventListener("mouseover", function () {
            startBtn.style.color = "#0056b3";
            startBtn.style.border = "#0056b3 2px solid";
        });
        startBtn.addEventListener("mouseout", function () {
            startBtn.style.color = "green";
            startBtn.style.border = "green 2px solid";
        });
    } else {
        port.postMessage({ action: "stopTask" });

        startBtn.innerHTML = "Click to start working";
        startBtn.style.color = "#444";
        startBtn.style.border = "#444 2px solid";
        startBtn.addEventListener("mouseout", function() {
            startBtn.style.color = "#444";
            startBtn.style.border = "#444 2px solid";
        });
    }
});