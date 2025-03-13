// Create a socket client using io()
const socket = io();

// Get elements from the dom
const activeWorkersField = document.getElementById("active-workers");

socket.on("worker amount change", (activeWorkers) => {
  console.log("worker changed");

  activeWorkersField.innerText = `Active workers: ${activeWorkers}`;
});
