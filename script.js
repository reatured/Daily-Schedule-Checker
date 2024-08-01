// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCHQ5kHLkZ9KaAGeMkk32b1PrPOuGC9tAY",
    authDomain: "daily-schedule-checker.firebaseapp.com",
    projectId: "daily-schedule-checker",
    storageBucket: "daily-schedule-checker.appspot.com",
    messagingSenderId: "504550360097",
    appId: "1:504550360097:web:6511d9c4f1824fb2e7cf60",
    measurementId: "G-RCP6GLD9K5",
    databaseURL: "https://daily-schedule-checker-default-rtdb.firebaseio.com/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Function to get today's date in YYYY-MM-DD format
function getFormattedDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

// Function to save checkbox states to Firebase
function saveData() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const date = getFormattedDate();
    checkboxes.forEach(checkbox => {
        const name = checkbox.parentElement.textContent.trim();
        const timeOfDay = checkbox.closest('tr').querySelector('td').textContent.trim();
        set(ref(database, `checkboxes/${date}/${name}`), {
            checked: checkbox.checked,
            timeOfDay: timeOfDay
        });
    });
    alert('Data saved!');
}

// Function to load checkbox states from Firebase
function loadData() {
    const dbRef = ref(database);
    const date = getFormattedDate();
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        const name = checkbox.parentElement.textContent.trim();
        get(child(dbRef, `checkboxes/${date}/${name}`)).then(snapshot => {
            if (snapshot.exists()) {
                checkbox.checked = snapshot.val().checked;
            }
        }).catch(error => {
            console.error(error);
        });
    });
}

// Function to test Firebase connection
function testConnection() {
    const testRef = ref(database, 'testConnection');
    set(testRef, { connected: true })
        .then(() => {
            return get(testRef);
        })
        .then(snapshot => {
            if (snapshot.exists() && snapshot.val().connected) {
                console.log('Firebase connection successful');
            } else {
                console.error('Firebase connection failed');
            }
        })
        .catch(error => {
            console.error('Firebase connection error:', error);
        });
}

// Function to set today's date in the subtitle
function setDate() {
    const dateElement = document.getElementById('date');
    const today = new Date();
    const formattedDate = today.toLocaleDateString();
    dateElement.textContent = formattedDate;
}

// Function to update the date and time in real-time
function updateDateTime() {
    const dateElement = document.getElementById('date');
    setInterval(() => {
        const now = new Date();
        const formattedDateTime = now.toLocaleString();
        dateElement.textContent = formattedDateTime;
    }, 1000);
}

// Attach functions to the window object to make them globally accessible
window.saveData = saveData;
window.loadData = loadData;
window.testConnection = testConnection;
window.setDate = setDate;
window.updateDateTime = updateDateTime;

// Load data and set date when the page loads
window.onload = () => {
    loadData();
    testConnection();
    setDate();
    updateDateTime();
};