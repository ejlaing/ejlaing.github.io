import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js';
import { getFirestore, collection, getDocs, 
  query, addDoc, orderBy, limit
} from 'https://www.gstatic.com/firebasejs/9.6.6/firebase-firestore-lite.js';

/* ---PREPARING DATABASE--- */
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
let numberoA = 0;

/* ---SEARCH FEATURES--- 
const typesList = document.querySelector(".types-datalist");
function myFunction(name) {
  const newOption = document.createElement("option");
  newOption.textContent = name;
  typesList.append(newOption);
}*/

const typeList = document.querySelector(".type-list");
const typeQuery = query(attractions, );
const typesQuerySnapshot = await getDocs(typeQuery);
let numberOfTypes = 0;
typesQuerySnapshot.forEach((doc) => {
  const type = doc.data().typeOfAttraction;
  const id = "typeoA" + numberOfTypes;

  const input = document.createElement("input");
  input.setAttribute("type", "checkbox");
  input.setAttribute("id", id);
  const label = document.createElement("label");
  label.setAttribute("for", id);
  label.textContent = type;
  const brk = document.createElement("br");

  typeList.append(input);
  typeList.append(label);
  typeList.append(brk);

  numberOfTypes++;
});

// Get data from firebase and display each using an HTML template
const attractionItemTemplate = document.querySelector(".attraction-item-template");
const attractionsList = document.querySelector(".attractions-list")
const attractionQuery = query(attractions, orderBy("name"), limit(5));
const attractionsQuerySnapshot = await getDocs(attractionQuery);
attractionsQuerySnapshot.forEach((doc) => {
  const attraction = attractionItemTemplate.content.cloneNode(true).children[0];
  const name = attraction.querySelector(".attraction-name")
  const typeOfAttraction = attraction.querySelector(".attraction-type")
  const location = attraction.querySelector(".attraction-loc")
  const hours = attraction.querySelector(".attraction-hours")
  const rating = attraction.querySelector(".attraction-rating")

  name.textContent = doc.data().name;
  typeOfAttraction.textContent = doc.data().typeOfAttraction;
  location.textContent = doc.data().location;
  hours.textContent = doc.data().openTime + " - " + doc.data().closeTime;
  rating.textContent = doc.data().rating + "/5.0";

  attractionsList.append(attraction);

  numberoA++; // Count up number of attractions
});

/* ---SUBMIT DATA TO DATABASE--- */
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
