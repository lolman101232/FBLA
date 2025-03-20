// Import Firebase modules
import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js";

// Firebase Configuration (Same as in homepage.html)
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

// Initialize Firebase **only if not already initialized**
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

// Function to get the current user's ID
function getCurrentUserId(callback) {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            callback(user.uid);
        } else {
            console.warn("⚠ No user is logged in.");
            callback(null);
        }
    });
}

// Fetch and format transactions for graphs
function fetchTransactionData(callback) {
    getCurrentUserId((userId) => {
        if (!userId) return callback(null);
        
        const transactionsRef = ref(db, `users/${userId}/transactions-manual`);
        get(transactionsRef).then((snapshot) => {
            if (snapshot.exists()) {
                const transactions = Object.values(snapshot.val());
                callback(organizeTransactionData(transactions));
            } else {
                console.warn("⚠ No transaction data found.");
                callback(null);
            }
        }).catch((error) => {
            console.error("❌ Error fetching transaction data:", error);
            callback(null);
        });
    });
}

function organizeTransactionData(transactions) {
    let spendingOverTime = {};
    let categoryBreakdown = {};
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(({ date, category, amount }) => {
        const transactionAmount = parseFloat(amount) || 0;

        // Always include in category breakdown, including deposits
        categoryBreakdown[category] = (categoryBreakdown[category] || 0) + transactionAmount;

        if (category.toLowerCase() === "deposit") {
            // Only add to total income for deposits
            totalIncome += transactionAmount;
            return; // Skip adding deposits to spendingOverTime
        }

        // Only add expenses to spending over time
        spendingOverTime[date] = (spendingOverTime[date] || 0) + transactionAmount;

        // Profit/Loss Calculation for expenses
        totalExpense += Math.abs(transactionAmount);
    });

    return {
        spendingOverTime: Object.entries(spendingOverTime).sort((a, b) => new Date(a[0]) - new Date(b[0])),
        categoryBreakdown,
        profitLoss: [totalIncome, totalExpense]
    };
}

export { fetchTransactionData };