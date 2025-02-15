// Function to check if the entered pin is correct
function checkPin() {
    const userPin = document.getElementById("pin").value.trim();
    const savedPin = "1234"; // Replace with actual saved PIN

    if (userPin === savedPin) {
        console.log("Pin code is correct. Transaction allowed.");
        alert("Transaction Approved ✅");
        // Perform the transaction here (redirect, process payment, etc.)
    } else {
        console.log("Incorrect pin code. Transaction denied.");
        alert("Incorrect PIN ❌");
    }
}

// Event listener for PIN submission (fix: prevent form refresh)
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("pinSubmit").addEventListener("click", function(event) {
        event.preventDefault(); // Stop form from submitting
        checkPin();
    });
});