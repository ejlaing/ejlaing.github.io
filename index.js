// Import functions from https://www.gstatic.com/firebasejs/9.6.6/
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js';
import { getFirestore, collection, getDocs, query, addDoc } from 'https://www.gstatic.com/firebasejs/9.6.6/firebase-firestore-lite.js';

let numberoA = 0;

// Initialize and configure Firebase
const firebaseApp = initializeApp({
    apiKey: "AIzaSyBlItp1Kq3TZp1aije7m9HxPzQG12zI7mU",
    authDomain: "fbla-attractions.firebaseapp.com",
    projectId: "fbla-attractions",
    storageBucket: "fbla-attractions.appspot.com",
    messagingSenderId: "1051181314735",
    appId: "1:1051181314735:web:2726c20e1841bb19a41a5a"
});

// Initialize database
const db = getFirestore(firebaseApp);

// Reference attractions collection
const attractions = collection(db, "attractions");

/* ---DISPLAY DATA ON WEBSITE--- */
// Create elements with gotten data
const attractionsList = document.getElementById("attractions-list");
function writeData(doc) {
  let dt = document.createElement("dt");
  let name = document.createElement("dd");
  let typeOfAttraction = document.createElement("dd");
  let location = document.createElement("dd");
  let hours = document.createElement("dd");
  let rating = document.createElement("dd");

  dt.setAttribute("id", doc.id);
  dt.innerHTML = doc.data().name;
  typeOfAttraction.innerHTML = doc.data().typeOfAttraction;
  location.innerHTML = doc.data().location;
  hours.innerHTML = doc.data().openTime + " - " + doc.data().closeTime;
  rating.innerHTML = doc.data().rating + "/5.0";

  dt.appendChild(name);
  dt.appendChild(typeOfAttraction);
  dt.appendChild(location);
  dt.appendChild(hours);
  dt.appendChild(rating);
  attractionsList.appendChild(dt);
    
  document.getElementById("number-oA").textContent = numberoA;
}

// Get data from firebase
const q = query(attractions);
const querySnapshot = await getDocs(q);
querySnapshot.forEach((doc) => {
  writeData(doc);
  numberoA++;
});

/* ---SUBMIT DATA TO DATABASE ---*/
// Get data from form
document.getElementById("submit-btn").onclick = getFormData;

function getFormData() {
  const form = document.forms[0];
  const attraction = {
    name:             form["name"].value,
    location:         form["location"].value,
    openTime:         form["openTime"].value,
    closeTime:        form["closeTime"].value,
    typeOfAttraction: form["typeoA"].value,
    rating:           form["rating"].value,
    description:      form["descr"].value,
  }
  setData(attraction);
  console.log(attraction)
}

// Add a new document in collection "attractions", with data
async function setData(newAttraction) {
  const docRef = await addDoc(collection(db, "attractions"), newAttraction);
}
