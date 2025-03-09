import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, get, onValue, remove } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { fetchTransactionData } from './jdataAnalyze.js';
import { auth as firebaseAuth, database as firebaseDatabase } from './firebase-config.js';
// ✅ Firebase configuration
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

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// ✅ Wrap inside a function
function setupCharts() {
    const spendingChartCanvas = document.getElementById("spendingChart");
    const categoriesChartCanvas = document.getElementById("categoriesChart");
    const profitlossChartCanvas = document.getElementById("profitlossChart");
    const recurringChartCanvas = document.getElementById("recurringChart");
    const userNameElement = document.getElementById("userName");

    onAuthStateChanged(auth, async (user) => {
        if (user) {
            console.log('Authenticated user:', user);

            const userRef = ref(database, "users/" + user.uid);
            const snapshot = await get(userRef);

            if (snapshot.exists()) {
                const userData = snapshot.val();
                console.log('User data from database:', userData);
                const userName = userData.full_name ? userData.full_name.split(" ")[0] : "User";
                userNameElement.textContent = userName;
                // ✅ Check if elements exist before using them
                if (!spendingChartCanvas || !categoriesChartCanvas || !profitlossChartCanvas || !recurringChartCanvas) {
                    console.error("❌ One or more chart elements are missing in the DOM.");
                    return;
                }

                // ✅ Fetch transaction data
                fetchTransactionData((data) => {
                    if (!data) {
                        console.warn("⚠ No transaction data available.");
                        return;
                    }

                    console.log("🔹 Processed Transaction Data:", data);

                    // 🌟 Spending Over Time Chart
                    // 🌟 Spending Over Time Chart
                    new Chart(spendingChartCanvas.getContext("2d"), {
                        type: "line",
                        data: {
                            labels: data.spendingOverTime.map(([date]) => date),
                            datasets: [{
                                label: "Spending",
                                data: data.spendingOverTime.map(([, amount]) => amount),
                                borderColor: "#7091E6", // Light purple color
                                backgroundColor: "#EDE8F5", // Light purple with transparency for fill
                                fill: true, // Set fill to true for a soft background color
                            }],
                        },
                    });
                    // 🌟 Category Breakdown Chart
                    new Chart(categoriesChartCanvas.getContext("2d"), {
                        type: "pie",
                        data: {
                            labels: Object.keys(data.categoryBreakdown),
                            datasets: [{
                                data: Object.values(data.categoryBreakdown),
                                backgroundColor: [
                                    "#3D52A0", // Light purple
                                    "#8697C4", // Lighter purple
                                    "#ADBBDA", // Very light purple
                                    "#EDE8F5",
                                    "#E5E1F2",
                                    "#D8D4F0",
                                ],
                            }],
                        },
                    });

                    // ✅ Load subscription data
                    loadSubscriptionData(user.uid);
                    loadProfitLossData(user.uid);
                });
            }
        } else { // User is signed out
            console.log('User is signed out.');
            window.location.href = "login.html";
        }
    });
}

function loadSubscriptionData(userId) {
    const transactionsRef = ref(database, "users/" + userId + "/transactions-manual");

    get(transactionsRef).then((snapshot) => {
        if (!snapshot.exists()) return;
        const transactions = snapshot.val();

        let subscriptionData = {};

        Object.entries(transactions).forEach(([key, transaction]) => {
            if (transaction.category === "subscription") {
                let category = (transaction.oneTimeCategory || "Unknown Subscription").toUpperCase();
                let amount = transaction.amount || 0;

                // ✅ If category exists, add to it; otherwise, create a new entry
                if (subscriptionData[category]) {
                    subscriptionData[category] += amount;
                } else {
                    subscriptionData[category] = amount;
                }
            }
        });

        // ✅ Convert to arrays for chart
        let subscriptionLabels = Object.keys(subscriptionData);
        let subscriptionValues = Object.values(subscriptionData);

        console.log("Aggregated Subscription Data:", { subscriptionLabels, subscriptionValues });

        // Render Chart
        renderSubscriptionChart(subscriptionLabels, subscriptionValues);
    }).catch(error => {
        console.error("Error fetching subscription data:", error);
    });
}
function loadProfitLossData(userId) {
    const transactionsRef = ref(database, "users/" + userId + "/transactions-manual");

    get(transactionsRef).then((snapshot) => {
        if (!snapshot.exists()) return;
        const transactions = snapshot.val();

        let profit = 0;
        let loss = 0;

        Object.entries(transactions).forEach(([key, transaction]) => {
            if (transaction.category === "deposit") {
                profit += transaction.amount || 0;
            } else if (transaction.category === "subscription" || transaction.category === "one-time") {
                loss += transaction.amount || 0;
            }
        });

        console.log("Profit/Loss Data:", { profit, loss });

        // Render Profit/Loss Chart
        renderProfitLossChart(profit, loss);
    }).catch(error => {
        console.error("Error fetching profit/loss data:", error);
    });
}

function renderSubscriptionChart(labels, values) {
    const ctx = document.getElementById("recurringChart").getContext("2d");
    new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: [ "#3D52A0",
                    "#7091E6",
                    "#8697C4",
                    "#ADBBDA",
                    "#EDE8F5"],
            }],
        },
    });
}
function renderProfitLossChart(profit, loss) {
    const ctx = document.getElementById("profitlossChart").getContext("2d");
    new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Profit & Loss"],
            datasets: [
                {
                    label: "Profit",
                    data: [profit],
                    backgroundColor: "#12b981",
                },
                {
                    label: "Loss",
                    data: [-loss], // Loss remains negative
                    backgroundColor: "#FF747C",
                }
            ],
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value >= 0 ? `$${value}` : `-$${Math.abs(value)}`;
                        }
                    }
                },
                x: {
                    barPercentage: 0.1, // Adjust bar thickness (lower value = thinner bars)
                    categoryPercentage: 0.5 // Adjust spacing between bars
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            let value = tooltipItem.raw;
                            return value >= 0 ? `Profit: $${value}` : `Loss: -$${Math.abs(value)}`;
                        }
                    }
                }
            }
        }
    });
}

function resetCanvas(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (canvas) {
        const parent = canvas.parentNode;
        parent.removeChild(canvas);
        const newCanvas = document.createElement("canvas");
        newCanvas.id = canvasId;
        parent.appendChild(newCanvas);
    }
}
// Function to check reviews
function checkReviews() {
    const reviewContainer = document.getElementById("reviewContainer");
    const checkboxes = reviewContainer.querySelectorAll("input[type='checkbox']");

    // Filter out remaining checkboxes (unchecked ones stay)
    const remainingCheckboxes = Array.from(checkboxes).filter(checkbox => checkbox.parentElement.style.display !== "none");

    if (remainingCheckboxes.length === 0) {
        reviewContainer.innerHTML = `<p id="nothingToReview">Nothing to Review!</p>`;
    }
}

// Mark as Finished button click event listener
document.getElementById("markAsFinished").addEventListener("click", () => {
    document.querySelectorAll("input[type='checkbox']:checked").forEach(checkbox => {
        checkbox.parentElement.style.display = "none"; // Hide checked checkboxes
    });

    checkReviews(); // Check and update UI if needed
});

// Function to update review checklist with live data from Firebase
function updateReviewChecklist() {
    auth.onAuthStateChanged((user) => {
        if (!user) return; // Exit if no user is logged in

        const transactionsRef = ref(database, `users/${user.uid}/transactions-manual`);
        const checklistContainer = document.querySelector(".checkbox-group");

        onValue(transactionsRef, (snapshot) => {
            checklistContainer.innerHTML = ""; // Clear existing content

            if (!snapshot.exists()) {
                checklistContainer.innerHTML = `<p id="nothingToReview">Nothing to Review!</p>`;
                return;
            }

            const transactions = snapshot.val();
            let hasCheckedItems = false;
            let count = 1; // Counter for unique IDs

            Object.entries(transactions).forEach(([key, item]) => {
                if (item.category !== "one-time" && item.category !== "subscription") return; // Only review these categories
                
                hasCheckedItems = true;
                const label = document.createElement("label");
                label.classList.add("checkbox-container");
                label.id = `transaction-${key}`; // Assign the unique ID for easier reference

                const input = document.createElement("input");
                input.type = "checkbox";
                input.id = `review${count}`;
                input.checked = true; // Default as checked for review

                const checkmark = document.createElement("span");
                checkmark.classList.add("checkmark");

                const textContainer = document.createElement("div");
                const checkboxLabel = document.createElement("div");
                checkboxLabel.classList.add("checkbox-label", "text-sm", "font-medium");
                checkboxLabel.textContent = item.oneTimeCategory.toUpperCase() || "Unknown Transaction";
                if (item.oneTimeCategory === "entertainment") {
                    checkboxLabel.textContent = item.oneTimeCategory.toUpperCase() + " 📺";
                }
                if (item.oneTimeCategory === "clothing") {
                    checkboxLabel.textContent = item.oneTimeCategory.toUpperCase() + " 🛍️";
                }
                if (item.oneTimeCategory === "food") {
                    checkboxLabel.textContent = item.oneTimeCategory.toUpperCase() + " 🍔";
                }
                if (item.oneTimeCategory === "transportation") {
                    checkboxLabel.textContent = item.oneTimeCategory.toUpperCase() + " 🚗";
                }
      
                if (item.category === "deposit") {
                    checkboxLabel.textContent = item.oneTimeCategory.toUpperCase() + " 💰";
                }
                if (item.oneTimeCategory === "medical") {
                    checkboxLabel.textContent = item.oneTimeCategory.toUpperCase() + " 🏥";
                }
                if (item.oneTimeCategory === "education") {
                    checkboxLabel.textContent = item.oneTimeCategory.toUpperCase() + " 📚";
                }
                if (item.oneTimeCategory === "personal") {
                    checkboxLabel.textContent = item.oneTimeCategory.toUpperCase() + " 🧴";
                }
                const checkboxDescription = document.createElement("div");
                checkboxDescription.classList.add("checkbox-description", "text-sm", "text-gray-500");
                checkboxDescription.textContent = `Amount: $${item.amount} | ${item.date}`;

                textContainer.appendChild(checkboxLabel);
                textContainer.appendChild(checkboxDescription);

                label.appendChild(input);
                label.appendChild(checkmark);
                label.appendChild(textContainer);

                checklistContainer.appendChild(label);
                count++;
            });

            if (!hasCheckedItems) {
                checklistContainer.innerHTML = `<p id="nothingToReview">Nothing to Review!</p>`;
            }
        });
    });
}

// Function to mark a transaction as reviewed
function markReviewed(userId, transactionId) {
    const transactionElement = document.getElementById(`transaction-${transactionId}`);
    
    // If the element exists, remove it from the DOM
    if (transactionElement) {
        transactionElement.style.display = "none"; // Just hide it, don't remove it
    }

    // Optionally, still keep the database update (if you need it)
    // const transactionRef = ref(database, `users/${userId}/transactions-manual/${transactionId}`);
    // remove(transactionRef);
}
// Call the function to listen for changes and update the review checklist
updateReviewChecklist();
document.getElementById("logoutButton").addEventListener("click", () => {
    firebaseAuth.signOut().then(() => {
        console.log("User signed out successfully.");
        window.location.href = "login.html";
    }).catch((error) => {
        console.error("Error signing out:", error);
    });
});


function kmeans(data, k) {
    const centroids = data.slice(0, k); // Initialize centroids with first k points
    let clusters = new Array(data.length).fill(-1);
    let changed = true;

    while (changed) {
        changed = false;

        // Assign points to closest cluster
        for (let i = 0; i < data.length; i++) {
            let minDist = Infinity, cluster = -1;
            for (let j = 0; j < k; j++) {
                let dist = Math.abs(data[i][0] - centroids[j][0]); // 1D distance (amount-based)
                if (dist < minDist) {
                    minDist = dist;
                    cluster = j;
                }
            }
            if (clusters[i] !== cluster) {
                clusters[i] = cluster;
                changed = true;
            }
        }

        // Update centroids
        let newCentroids = new Array(k).fill(null).map(() => [0, 0]);
        let counts = new Array(k).fill(0);
        for (let i = 0; i < data.length; i++) {
            newCentroids[clusters[i]][0] += data[i][0];
            newCentroids[clusters[i]][1] += data[i][1];
            counts[clusters[i]]++;
        }
        for (let j = 0; j < k; j++) {
            if (counts[j] > 0) {
                newCentroids[j][0] /= counts[j];
                newCentroids[j][1] /= counts[j];
            }
        }
        centroids.splice(0, k, ...newCentroids);
    }

    return { clusters, centroids };
}
function fetchAndClusterTransactions() {
    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            console.log("User is not logged in.");
            return;
        }

        const transactionsRef = ref(database, `users/${user.uid}/transactions-manual`);
        const snapshot = await get(transactionsRef);

        if (!snapshot.exists()) {
            console.log("No transactions found.");
            return;
        }

        const transactions = snapshot.val();
        let dataPoints = [];
        let categoriesMap = {}; // To map category names to cluster-friendly numbers
        let categoryIndex = 1;

        // ✅ Extract transactions and map categories to numbers
        Object.entries(transactions).forEach(([key, transaction]) => {
            let amount = transaction.amount || 0;
            let category = transaction.oneTimeCategory || "Other";

            // Assign numerical values to categories
            if (!categoriesMap[category]) {
                categoriesMap[category] = categoryIndex++;
            }

            dataPoints.push([amount, categoriesMap[category]]);
        });

        console.log("Processed Data for K-Means:", dataPoints);

        // ✅ Apply K-Means clustering (3 clusters)
        const clusters = kmeans(dataPoints, 3);
        console.log("K-Means Clustering Result:", clusters);

        // ✅ Prepare data for Chart.js
        const datasets = clusters.centroids.map((centroid, index) => {
            return {
                label: `Cluster ${index + 1}`,
                data: clusters.clusters
                    .map((cluster, i) => (cluster === index ? { x: dataPoints[i][0], y: dataPoints[i][1] } : null))
                    .filter((point) => point !== null),
                backgroundColor: ["rgba(255, 99, 132, 0.6)", "rgba(54, 162, 235, 0.6)", "rgba(75, 192, 192, 0.6)"][index],
                borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)", "rgba(75, 192, 192, 1)"][index],
                borderWidth: 1,
            };
        });

        // ✅ Render the K-Means clustering chart using Chart.js
        const ctx = document.getElementById("clusterChart").getContext("2d");
        new Chart(ctx, {
            type: "scatter",
            data: { datasets },
            options: {
                responsive: true,
                scales: {
                    x: { title: { display: true, text: "Amount ($)" } },
                    y: {
                        title: { display: true, text: "Category" },
                        ticks: {
                            callback: (value) =>
                                Object.keys(categoriesMap).find((key) => categoriesMap[key] === value) || "Other",
                        },
                    },
                },
                plugins: {
                    legend: { position: "top", display: true },
                    tooltip: {
                        callbacks: {
                            label: (tooltipItem) => {
                                let categoryLabel = Object.keys(categoriesMap).find(
                                    (key) => categoriesMap[key] === tooltipItem.raw.y
                                );
                                return `Amount: $${tooltipItem.raw.x} | Category: ${categoryLabel}`;
                            },
                        },
                    },
                },
            },
        });
    });
}
document.addEventListener("DOMContentLoaded", function () {
    // Toggle chatbot visibility
    function toggleChatbot() {
        const chatbotContainer = document.getElementById('chatbotContainer');
        if (chatbotContainer.style.display === 'none' || chatbotContainer.style.display === '') {
            chatbotContainer.style.display = 'block';
        } else {
            chatbotContainer.style.display = 'none';
        }
    }

    // Attach event listener to the chatbot toggle button
    const chatbotBtn = document.querySelector('.chatbot-btn');
    if (chatbotBtn) {
        chatbotBtn.addEventListener('click', toggleChatbot);
    }
});
// ✅ Call the function to fetch and cluster transaction data
fetchAndClusterTransactions();
setupCharts();