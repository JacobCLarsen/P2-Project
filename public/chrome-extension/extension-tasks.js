// Function for fetching tasks
export function fetchTask(mySocket) {
    let message = {
        action: "request task",
        data: null,
        id: "Extension:",
    };
  
    // When the server receives the message, it will send a task back to the client
    mySocket.send(JSON.stringify(message));
}

// Function to start work
export async function startWork(task, mySocket) {
    // Crack hashes
    let weakPasswords = await dictionaryAttack(task.hashes, task.dictionary);
  
    if (weakPasswords.length > 0) {
        console.log(
        `weak passwords found: ${weakPasswords} in subtask ${task.id}`
        );
        console.log("Posting message back to main script");
    } else {
        console.log(`no weak passwords in task ${task.id}`);
    };
    
    let taskresult = {
        action: "send result",
        result: "I did it!",
        taskId: task.id
    };
    mySocket.send(JSON.stringify(taskresult));
  
    chrome.storage.local.get("isWorking", function(data) {
        if (data.isWorking) {
            fetchTask(mySocket);
        } else {
            console.log("Task stopped. Not fetching a new task.");
        }
    });
}
  
async function dictionaryAttack(targetHashes, dictionaryBatch) {
    let weakPasswordArray = [];
    // "For of" loop that goes through each password of the dictionary.
    for (let dictionaryWord of dictionaryBatch) {
        for (let targetHash of targetHashes) {
            // Hashes the current password and assigns it to the const hashedPassword.
            const hashedWord = await hashSHA512(dictionaryWord);
            // If hashedPassword is equal to the target hashed password, then returns correct password
            if (hashedWord === targetHash) {
                weakPasswordArray.push(dictionaryWord);
            }
        }
    }

    return weakPasswordArray;
}
  
async function hashSHA512(message) {
    // Converts string into binary format
    const encoder = new TextEncoder();
    // Transfors the text into bytes
    const data = encoder.encode(message);
    // Computes the SHA-512 hash of the input
    const hashBuffer = await crypto.subtle.digest("SHA-512", data);
    // Converts hashBuffer to hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    // Converts each byte into hexadecimal
    const hashHex = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    return hashHex;
}