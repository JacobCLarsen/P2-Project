import { dictionaryAttack } from "./dictionary-attack";

// This worker script takes
onmessage = (e) => {
  console.log(`Message received from main script: ${e.data.hashes}`);

  // Crack hashes
  let weakPasswords = dictionaryAttack(e.data.hashes, e.data.dictionary);

  if (weakPasswords) {
    const workerResult = weakPasswords;
    console.log(`weak passwords found: ${weakPasswords}`);

    console.log("Posting message back to main script");
    postMessage(workerResult);
  }
  console.log(`no weak passwords in task ${e.data.id}`);
};
