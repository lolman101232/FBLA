// Firebase configuration and initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAUJPviTJaAcoMoP6wPn_LCUam7JoQROTY",
    authDomain: "fbla-9824b.firebaseapp.com",
    databaseURL: "https://fbla-9824b-default-rtdb.firebaseio.com",
    projectId: "fbla-9824b",
    storageBucket: "fbla-9824b.firebasestorage.app",
    messagingSenderId: "158608304412",
    appId: "1:158608304412:web:4d47e398d859429ae472d9",
    measurementId: "G-J87WWW4MQV"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export { auth, database };
