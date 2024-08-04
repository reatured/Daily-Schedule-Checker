// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getDatabase, ref, set, get,update, child } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-database.js";
let allData; 
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
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
const day = String(today.getDate()).padStart(2, '0');

return `${year}-${month}-${day}`;
}

//function that save all the data from all dates to a variable and print to the console
function getAllData() {
    get(ref(database, '/')).then((snapshot) => {
        if (snapshot.exists()) {
            console.log(snapshot.val());
            allData = snapshot.val();
            return snapshot.val();
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error(error);
    });

}

//function that save all the data from a specific date to a variable and print to the console
function getData(date) {
    console.log(date);
    console.log(getAllData()["checkboxes"][date]);
    return getAllData()["checkboxes"][date];
}

//function that gets today's data
function getTodaysData() {
    return getData(getFormattedDate());
}
// getAllData();
// getData(getFormattedDate());

//function that fill in the table div in the html with today's data
fillTable(getFormattedDate());

function fillTable(date) {
    let table = document.getElementById("table");
    let data = getData(date);
    let tableHTML = "";
    for(let i = 0; i < data.length; i++){
        tableHTML += `<tr><td>${data[i].name}</td><td>${data[i].time}</td><td>${data[i].checked}</td></tr>`;
    }
    table.innerHTML = tableHTML;
}

