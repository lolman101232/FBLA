import { auth } from './firebase-config.js';
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { browserSessionPersistence } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const rememberMeCheckbox = document.getElementById("rememberMe");
const message = document.getElementById("message");

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = emailInput.value;
    const password = passwordInput.value;

    try {
        // Set persistence based on "Remember Me" checkbox
        await setPersistence(auth, rememberMeCheckbox.checked ? browserLocalPersistence : browserSessionPersistence);        // Attempt to sign in
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("User logged in:", userCredential.user);

        // Redirect to homepage on success
        window.location.href = "homepage.html";
    } catch (error) {
        console.error("Login error:", error);
        message.textContent = "Incorrect Password";
    }
});