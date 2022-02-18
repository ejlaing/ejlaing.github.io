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

/* ---DATA MANAGEMENT--- */
class attraction {
  constructor(name, typeOfAttraction, location, openTime, closeTime, rating) {
    this.name = name;
    this.typeOfAttraction = typeOfAttraction;
    this.location = location;
    this.openTime = openTime;
    this.closeTime = closeTime;
    this.rating = rating;
  }
  hours() {
    return this.openTime + " - " + this.closeTime;
  }
}

// Get data from Firebase, store it in attractionsArray
const attractionsArray = [];
const attractionQuery = query(attractions, orderBy("name"));
const attractionsQuerySnapshot = await getDocs(attractionQuery);
attractionsQuerySnapshot.forEach((doc) => {
  const newAttraction = new attraction();

  newAttraction.name = doc.data().name;
  newAttraction.typeOfAttraction = doc.data().typeOfAttraction;
  newAttraction.location = doc.data().location;
  newAttraction.openTime = doc.data().openTime;
  newAttraction.closeTime = doc.data().closeTime;
  newAttraction.rating = doc.data().rating;

  attractionsArray.push(newAttraction);
});
console.log(attractionsArray);

// Display data on screen as cards
const attractionItemTemplate = document.querySelector(".attraction-item-template");
const attractionsList = document.querySelector(".attractions-list")
attractionsArray.forEach((thisAttraction) => {
  const attractionCard = attractionItemTemplate.content.cloneNode(true).children[0];
  const name = attractionCard.querySelector(".attraction-name")
  const typeOfAttraction = attractionCard.querySelector(".attraction-type")
  const location = attractionCard.querySelector(".attraction-loc")
  const hours = attractionCard.querySelector(".attraction-hours")
  const rating = attractionCard.querySelector(".attraction-rating")

  name.textContent = thisAttraction.name;
  typeOfAttraction.textContent = thisAttraction.typeOfAttraction;
  location.textContent = thisAttraction.location;
  hours.textContent = thisAttraction.hours();
  rating.textContent = thisAttraction.rating + "/5.0";

  attractionsList.append(attractionCard);
});

// Search based on name
const searchInput = document.querySelector("#search-spec");
searchInput.addEventListener("input", (e) => {
  const searchValue = e.target.value.toLowerCase();
  attractionsList.childNodes.forEach((attractionCard) => {
    const visible = attractionCard.querySelector(".attraction-name").textContent.toLowerCase().includes(searchValue);
    attractionCard.classList.toggle("hide", !visible);
  })
});

// Search based on location
const locationInput = document.querySelector("#location-spec");
locationInput.addEventListener("input", (e) => {
  const searchValue = e.target.value.toLowerCase();
  attractionsList.childNodes.forEach((attractionCard) => {
    const visible = attractionCard.querySelector(".attraction-loc").textContent.toLowerCase().includes(searchValue);
    attractionCard.classList.toggle("hide", !visible);
  })
});

// Search based on type of attraction
const typeInput = document.querySelector("#typeoA-spec");
typeInput.addEventListener("input", (e) => {
  const searchValue = e.target.value.toLowerCase();
  attractionsList.childNodes.forEach((attractionCard) => {
    const visible = attractionCard.querySelector(".attraction-type").textContent.toLowerCase().includes(searchValue);
    attractionCard.classList.toggle("hide", !visible);
  });
});

/* ---SUBMIT DATA TO DATABASE--- */
// Get data from form
document.querySelector("#submit-btn").addEventListener("click", getFormData);
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