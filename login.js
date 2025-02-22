import { auth } from './firebase-config.js'; // Ensure the './' prefix
import { signInWithEmailAndPassword, setPersistence, browserSessionPersistence } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const message = document.getElementById("message");

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = emailInput.value;
    const password = passwordInput.value;

    try {
        // Set default session persistence
        await setPersistence(auth, browserSessionPersistence);

        // Attempt to log in the user
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("User logged in:", userCredential.user);

        // Redirect to homepage on success
        window.location.href = "homepage.html";
    } catch (error) {
        console.error("Login error:", error);
        message.textContent = "Incorrect email or password. Please try again.";
    }
});