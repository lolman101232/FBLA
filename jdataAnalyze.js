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

    return clusters;
}
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

    return {
        "Profit vs Loss": [totalIncome, totalExpense],
    };
}



// Export function for use in HTML script
export { analyzeTransactions, kMeansCluster };