import { hashSHA512 } from "./hash-functions";

// This worker script takes
onmessage = async (e) => {
  const task = e.data;
  console.log(`Worker received task: ${JSON.stringify(task)}`);

  const hashedPassword = await hashSHA512(task.password);
  if (hashedPassword === task.targetHash) {
    console.log(`Password found: ${task.password}`);
    postMessage({ success: true, password: task.password });
  } else {
    postMessage({ success: false });
  }
};
