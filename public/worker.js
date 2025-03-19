// This worker script takes
onmessage = (e) => {
  console.log(`Message received from main script: ${e.data}`);

  const workerResult = `${e.data}000 - (solved)`;
  console.log("Posting message back to main script");
  postMessage(workerResult);
};
