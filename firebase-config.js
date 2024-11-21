import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAUJPviTJaAcoMoP6wPn_LCUam7JoQROTY",
    authDomain: "fbla-9824b.firebaseapp.com",
    projectId: "fbla-9824b",
    storageBucket: "fbla-9824b.appspot.com",
    messagingSenderId: "158608304412",
    appId: "1:158608304412:web:4d47e398d859429ae472d9",
    measurementId: "G-J87WWW4MQV"
};

// Initialize Firebase and Auth once
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };