// This worker script takes
onmessage = (e) => {
  console.log(`Message received from main script: ${e.data}`);

  const workerResult = `${e.data} \n (solved)`;
  console.log("Posting message back to main script");
  postMessage(workerResult);
};
