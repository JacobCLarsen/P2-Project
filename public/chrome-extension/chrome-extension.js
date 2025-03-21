// Script for the basic functionality of the physical button in the extension.

const startBtn = document.getElementById("startBtn");

// Ensure the button doesn't reset, when the extension window is closed.
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

// When the extension is opened a message appears in console
const port = chrome.runtime.connect({ name: "Extension" });

// Event listener for startBtn to start and stop work
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

            // Save the state of the button to chrome.storage
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


            // Save the state of the button to chrome.storage
            chrome.storage.local.set({ isWorking: false });
        }
    });
});