// Firebase configuration (ensure Firebase is initialized in your HTML page)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";
import { getDatabase, ref, set, push} from "https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js";

// Firebase config (replace with your Firebase project configuration)
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
const db = getDatabase(app);

// kMeans Clustering Function
function kMeansCluster(data, numClusters) {
    const centroids = data.slice(0, numClusters);
    let clusters = new Array(data.length).fill(-1);
    let changed = true;

    while (changed) {
        changed = false;

        // Assign points to the closest centroid
        for (let i = 0; i < data.length; i++) {
            let minDist = Infinity, cluster = -1;
            for (let j = 0; j < numClusters; j++) {
                const dist = Math.sqrt(
                    (data[i][0] - centroids[j][0]) ** 2 + (data[i][1] - centroids[j][1]) ** 2
                );
                if (dist < minDist) {
                    minDist = dist;
                    cluster = j;
                }
            }
            if (clusters[i] !== cluster) {
                changed = true;
                clusters[i] = cluster;
            }
        }

        // Update centroids
        centroids.forEach((_, j) => {
            const members = data.filter((_, i) => clusters[i] === j);
            if (members.length > 0) {
                centroids[j] = members.reduce(
                    (a, b) => [a[0] + b[0], a[1] + b[1]],
                    [0, 0]
                ).map(x => x / members.length);
            }
        });
    }

    // Push the cluster data to Firebase
    const newClusterRef = push(ref(db, 'kMeansClusters/'));
    set(newClusterRef, {
        clusters: clusters,
        centroids: centroids,
        timestamp: Date.now()
    }).then(() => {
        console.log("Cluster data successfully added to Firebase!");
    }).catch((error) => {
        console.error("Error adding cluster data: ", error);
    });

    return clusters;
}

// Analyze Transactions Function
function analyzeTransactions(userData) {
    let totalIncome = 0;
    let totalExpense = 0;

    console.log("📥 Raw User Data:", userData);

    // 🔹 Make sure transactions exist
    let transactions = userData.transactions;
    if (!transactions || !Array.isArray(transactions)) {
        console.warn("⚠ No valid transactions found. Defaulting to placeholder data.");
        return { "Profit vs Loss": [0, 0] };
    }

    console.log("✅ Transactions Retrieved:", transactions);

    transactions.forEach((txn) => {
        let amount = parseFloat(txn.amount);
        let type = txn.type; // Ensure type is correctly assigned

        if (!isNaN(amount) && (type === "income" || type === "expense")) {
            if (type === "income") {
                totalIncome += amount;
            } else {
                totalExpense += amount;
            }
        } else {
            console.warn("⚠ Invalid transaction detected:", txn);
        }
    });

    console.log("💰 Final Profit/Loss Calculation:", { Income: totalIncome, Expense: totalExpense });

    // Push profit/loss data to Firebase
    const newTransactionRef = push(ref(db, 'transactions/'));
    set(newTransactionRef, {
        totalIncome: totalIncome,
        totalExpense: totalExpense,
        timestamp: Date.now()
    }).then(() => {
        console.log("Transaction data successfully added to Firebase!");
    }).catch((error) => {
        console.error("Error adding transaction data: ", error);
    });

    return {
        "Profit vs Loss": [totalIncome, totalExpense],
    };
}

// Sample Data for analyzeTransactions
const userData = {
    userId: "user123",
    transactions: [
        { amount: "1200", type: "income" },
        { amount: "500", type: "expense" },
        { amount: "800", type: "income" },
        { amount: "200", type: "expense" },
        { amount: "1500", type: "income" },
        { amount: "300", type: "expense" },
    ]
};

// Sample Data for kMeansCluster
const data = [
    [2, 3],    // Point 1
    [1, 1],    // Point 2
    [3, 4],    // Point 3
    [10, 10],  // Point 4
    [12, 12],  // Point 5
    [11, 11],  // Point 6
    [8, 8],    // Point 7
    [13, 14],  // Point 8
    [9, 9],    // Point 9
    [15, 16],  // Point 10
];
const numClusters = 3;

// Call functions
console.log("Analyzing Transactions...");
const profitLoss = analyzeTransactions(userData);
console.log("Profit vs Loss:", profitLoss);

console.log("\nRunning K-Means Clustering...");
const clusters = kMeansCluster(data, numClusters);
console.log("Cluster Assignment:", clusters);

// Export functions for use in HTML script
export { analyzeTransactions, kMeansCluster };