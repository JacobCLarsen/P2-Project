onmessage = (e) => {
  console.log(`Message received from main script: ${e.data}`);

  const workerResult = `${e.data}000`;
  console.log("Posting message back to main script");
  postMessage(workerResult);
};
