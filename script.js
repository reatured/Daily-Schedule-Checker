// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getDatabase, ref, set, get,update, child } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-database.js";

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
// Function to get today's date in YYYY-MM-DD format
function getFormattedDate() {
    const today = new Date();
    if (today.getHours() < 4) {
        // If the time is before 4 AM, use the previous date
        today.setDate(today.getDate() - 1);
    }
    return today.toISOString().split('T')[0];
}

// Function to save checkbox states to Firebase
function saveData() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const date = getFormattedDate();
    const dateRef = ref(database, `checkboxes/${date}`);

    get(dateRef).then((snapshot) => {
        if (!snapshot.exists()) {
            // New date detected, reset all checkboxes
            checkboxes.forEach(checkbox => {
                checkbox.checked = false;
            });
        }

        // Save the state of all checkboxes
        checkboxes.forEach(checkbox => {
            const name = checkbox.parentElement.textContent.trim();
            const timeOfDay = checkbox.closest('tr').querySelector('td').textContent.trim();
            set(ref(database, `checkboxes/${date}/${name}`), {
                checked: checkbox.checked,
                timeOfDay: timeOfDay
            });
        });
    }).catch((error) => {
        console.error('Error checking date:', error);
    });
}

document.addEventListener('DOMContentLoaded', (event) => {
    function addTodaysDate() {
        const dateElement = document.getElementById('date');
        const today = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        dateElement.textContent = today.toLocaleDateString(undefined, options);
    }

    function addCheckboxListeners() {
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (event) => {
                saveData();
            });
        });
    }

    addTodaysDate();
    addCheckboxListeners();
});

// Function to load checkbox states from Firebase
function loadData() {
    const dbRef = ref(database);
    const date = getFormattedDate();
    const dateRef = ref(database, `checkboxes/${date}`);
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');

    get(dateRef).then((snapshot) => {
        if (!snapshot.exists()) {
            // New date detected, reset all checkboxes and create new date entry in the database
            checkboxes.forEach(checkbox => {
                checkbox.checked = false;
            });

            // Create new date entry in the database
            const updates = {};
            checkboxes.forEach(checkbox => {
                const name = checkbox.parentElement.textContent.trim();
                updates[`checkboxes/${date}/${name}`] = { checked: false };
            });
            update(dbRef, updates).catch(error => {
                console.error('Error creating new date entry:', error);
            });
        } else {
            // Load the state of all checkboxes
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
    }).catch((error) => {
        console.error('Error checking date:', error);
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
    
    // Check if the current time is before 4 AM
    if (today.getHours() < 4) {
        // If it is, set the date to the previous day
        today.setDate(today.getDate() - 1);
    }
    
    const formattedDate = today.toLocaleDateString();
    dateElement.textContent = formattedDate;
}



// Attach functions to the window object to make them globally accessible
window.saveData = saveData;
window.loadData = loadData;
window.testConnection = testConnection;
window.setDate = setDate;


// Load data and set date when the page loads
window.onload = () => {
    loadData();
    testConnection();
    setDate();
};

