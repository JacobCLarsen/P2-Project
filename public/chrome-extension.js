const startBtn = document.getElementById("startBtn");

// Restore the button state when the popup is opened
chrome.storage.local.get("isWorking", (data) => {
    if (data.isWorking) {
        startBtn.innerHTML = "Hashing passwords ...";
        startBtn.style.color = "green";
        startBtn.style.border = "green 2px solid";
        startBtn.addEventListener("mouseover", function() {
            startBtn.style.color = "#0056b3";
            startBtn.style.border = "#0056b3 2px solid";
        });
        startBtn.addEventListener("mouseout", function () {
            startBtn.style.color = "green";
            startBtn.style.border = "green 2px solid";
        });
    } else {
        startBtn.innerHTML = "Click to start working";
        startBtn.style.color = "#444";
        startBtn.style.border = "#444 2px solid";
        startBtn.addEventListener("mouseover", function() {
            startBtn.style.color = "#0056b3";
            startBtn.style.border = "#0056b3 2px solid";
        });
        startBtn.addEventListener("mouseout", function() {
            startBtn.style.color = "#444";
            startBtn.style.border = "#444 2px solid";
        });
    }
});

// Event listener for startBtn to start and stop work
const port = chrome.runtime.connect({ name: "popup" });

startBtn.addEventListener("click", function () {
    chrome.storage.local.get("isWorking", (data) => {
        const isWorking = data.isWorking || false;

        if (!isWorking) {
            port.postMessage({ action: "startTask" });

            // Update button state
            startBtn.innerHTML = "Hashing passwords ...";
            startBtn.style.color = "green";
            startBtn.style.border = "green 2px solid";
            startBtn.addEventListener("mouseover", function() {
                startBtn.style.color = "#0056b3";
                startBtn.style.border = "#0056b3 2px solid";
            });
            startBtn.addEventListener("mouseout", function() {
                startBtn.style.color = "green";
                startBtn.style.border = "green 2px solid";
            });

            // Save the state to chrome.storage
            chrome.storage.local.set({ isWorking: true });
        } else {
            port.postMessage({ action: "stopTask" });

            // Update button state
            startBtn.innerHTML = "Click to start working";
            startBtn.style.color = "#444";
            startBtn.style.border = "#444 2px solid";
            startBtn.addEventListener("mouseover", function() {
                startBtn.style.color = "#0056b3";
                startBtn.style.border = "#0056b3 2px solid";
            });
            startBtn.addEventListener("mouseout", function() {
                startBtn.style.color = "#444";
                startBtn.style.border = "#444 2px solid";
            });


            // Save the state to chrome.storage
            chrome.storage.local.set({ isWorking: false });
        }
    });
});