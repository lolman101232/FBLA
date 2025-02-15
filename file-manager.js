import { db, storage } from './firebase-config.js';
import { ref, uploadBytes, getDownloadURL, listAll } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";

// List all files
export async function listFiles() {
    try {
        const storageRef = ref(storage);
        const fileList = await listAll(storageRef);
        return fileList.items.map((itemRef) => itemRef.name);
    } catch (error) {
        console.error("Error listing files:", error);
        return [];
    }
}

// Read a file
export async function readFile(fileName) {
    try {
        const fileRef = ref(storage, fileName);
        const fileURL = await getDownloadURL(fileRef);
        console.log(`File URL: ${fileURL}`);
        alert(`File URL: ${fileURL}`);
    } catch (error) {
        console.error("Error reading file:", error);
    }
}

// Create a new file
export async function createFile(fileName, content) {
    try {
        const fileRef = ref(storage, fileName);
        const blob = new Blob([content], { type: "text/plain" });
        await uploadBytes(fileRef, blob);
        console.log(`File '${fileName}' created successfully.`);
        alert(`File '${fileName}' created successfully.`);
    } catch (error) {
        console.error("Error creating file:", error);
    }
}

// Edit a file
export async function editFile(fileName, contentToAppend) {
    try {
        const fileRef = ref(storage, fileName);
        const fileURL = await getDownloadURL(fileRef);

        const response = await fetch(fileURL);
        const existingContent = await response.text();
        const newContent = existingContent + "\n" + contentToAppend;

        const blob = new Blob([newContent], { type: "text/plain" });
        await uploadBytes(fileRef, blob);
        console.log("Text appended successfully.");
        alert("Text appended successfully.");
    } catch (error) {
        console.error("Error editing file:", error);
    }
}