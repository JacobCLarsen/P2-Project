onmessage = (e) => {
  console.log(`Message received from main script: ${e.data}`);
  const reverseString = (str) => str.split("").reverse().join("");

  const workerResult = `Result: ${reverseString(e.data)}`;
  console.log("Posting message back to main script");
  postMessage(workerResult);
};
