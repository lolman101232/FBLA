async function register(event) {
  event.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const fullName = document.getElementById("fullName").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value.trim();

  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  if (!validate_email(email)) {
    alert("Invalid email address!");
    return;
  }
  if (!validate_password(password)) {
    alert("Password must be at least 6 characters long!");
    return;
  }
  if (!validate_field(fullName)) {
    alert("Full name is required!");
    return;
  }

  try {
    // Create the user first
    const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;
    console.log("User created:", user);

    // Now, write the user data to the database
    const userRef = firebase.database().ref("users/" + user.uid);
    const userData = {
      email: email,
      full_name: fullName,
      created_at: new Date().toISOString(),
    };

    await userRef.set(userData);
    alert("User registered successfully!");
  } catch (error) {
    console.error("Registration error:", error);
    alert(error.message);
  }
}

// Add event listener to the form
document.getElementById("registerForm").addEventListener("submit", register);

// Validation functions
function validate_email(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validate_password(password) {
  return password.length >= 6;
}

function validate_field(field) {
  return field !== null && field.trim() !== "";
}