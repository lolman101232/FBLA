// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";
import { getFirestore, collection, getDocs, addDoc, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL, listAll } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAUJPviTJaAcoMoP6wPn_LCUam7JoQROTY",
    authDomain: "fbla-9824b.firebaseapp.com",
    databaseURL: "https://fbla-9824b-default-rtdb.firebaseio.com",
    projectId: "fbla-9824b",
    storageBucket: "fbla-9824b.appspot.com",
    messagingSenderId: "158608304412",
    appId: "1:158608304412:web:4d47e398d859429ae472d9",
    measurementId: "G-J87WWW4MQV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const db = getFirestore(app);
const storage = getStorage(app);

async function listFiles() {
    try {
        const storageRef = ref(storage);
        const fileList = await listAll(storageRef);
        return fileList.items.map((itemRef) => itemRef.name);
    } catch (error) {
        console.error("Error listing files:", error);
        return [];
    }
}

async function readFile(fileName) {
  try {
    const fileRef = ref(storage, fileName);
    const fileURL = await getDownloadURL(fileRef);
    console.log("\n--- File Contents ---");
    console.log(`File URL: ${fileURL}`);
    // Fetch the file content if required
  } catch (error) {
    console.error("Error reading file:", error);
    throw error;
  }
}

async function createFile(fileName, content) {
    try {
        const fileRef = ref(storage, fileName);
        const blob = new Blob([content], { type: "text/plain" });
        await uploadBytes(fileRef, blob);
        console.log(`File '${fileName}' created successfully.`);
    } catch (error) {
        console.error("Error creating file:", error);
    }
}

async function editFile(fileName, contentToAppend) {
    try {
        const fileRef = ref(storage, fileName);
        const fileURL = await getDownloadURL(fileRef);

        const response = await fetch(fileURL);
        const existingContent = await response.text();
        const newContent = existingContent + "\n" + contentToAppend;

        const blob = new Blob([newContent], { type: "text/plain" });
        await uploadBytes(fileRef, blob);
        console.log("Text appended successfully.");
    } catch (error) {
        console.error("Error editing file:", error);
    }
}

function displayMenu() {
    console.log("\nFile Manager");
    console.log("1. Open and read a file");
    console.log("2. Edit a file (append text)");
    console.log("3. Create a new file");
    console.log("4. Display file names");
    console.log("5. Exit");
    return prompt("Choose an option (1-5): ");
}

async function main() {
    while (true) {
        const choice = displayMenu();

        if (choice === "1") {
            const files = await listFiles();
            if (files.length > 0) {
                console.log("\nThe names of the current files are as follow:");
                files.forEach((file, index) => console.log(`${index + 1}. ${file}`));
            } else {
                console.log("No current files");
            }
            const fileName = prompt("Enter the file name to read: ");
            await readFile(fileName);

        } else if (choice === "2") {
            const files = await listFiles();
            if (files.length > 0) {
                console.log("\nThe names of the current files are as follow:");
                files.forEach((file, index) => console.log(`${index + 1}. ${file}`));
            } else {
                console.log("No current files");
            }
            const fileName = prompt("Enter the file name to edit: ");
            const textToAppend = prompt("Enter text to append: ");
            await editFile(fileName, textToAppend);

        } else if (choice === "3") {
            const fileName = prompt("Enter the new file name: ");
            const content = prompt("Enter content for the new file: ");
            await createFile(fileName, content);

        } else if (choice === "4") {
            const files = await listFiles();
            if (files.length > 0) {
                console.log("\nThe names of the current files are as follow:");
                files.forEach((file, index) => console.log(`${index + 1}. ${file}`));
            } else {
                console.log("No current files");
            }

        } else if (choice === "5") {
            console.log("Exiting program. Goodbye!");
            break;

        } else {
            console.log("Invalid choice. Please select a valid option.");
        }
    }
}
export { listFiles, readFile, createFile, editFile };
// Run the program
main();