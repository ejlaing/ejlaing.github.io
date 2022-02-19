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
const attractionsList = document.querySelector(".attractions-list");
attractionsArray.forEach((thisAttraction) => {
  const attractionCard = attractionItemTemplate.content.cloneNode(true).children[0];
  const name = attractionCard.querySelector(".attraction-name");
  const typeOfAttraction = attractionCard.querySelector(".attraction-type");
  const location = attractionCard.querySelector(".attraction-loc");
  const hours = attractionCard.querySelector(".attraction-hours");
  const rating = attractionCard.querySelector(".attraction-rating");

  name.textContent = thisAttraction.name;
  typeOfAttraction.textContent = thisAttraction.typeOfAttraction;
  location.textContent = thisAttraction.location;
  hours.textContent = thisAttraction.hours();
  rating.textContent = thisAttraction.rating + "/5.0";

  attractionsList.append(attractionCard);
});

// Function for filling Select dropdowns
function fillSelectElement(array, element) {
  array.forEach((option) => {
    const newOption = document.createElement("option");
    newOption.setAttribute("value", option);
    newOption.textContent = option;

    element.appendChild(newOption);
  });
}

// Make new array of unique locations
let locationsArray = [];
attractionsArray.forEach((attractions) => {
  locationsArray.push(attractions.location);
});
const uniqLocations = [...new Set(locationsArray)];
// Add unique locations to the location dropdown
const locationInput = document.querySelector("#location-spec");
fillSelectElement(uniqLocations, locationInput);

// Make new array of unique types of attraction
let typesArray = [];
attractionsArray.forEach((attractions) => {
  typesArray.push(attractions.typeOfAttraction);
});
const uniqTypes = [...new Set(typesArray)];
// Add unique locations to the location dropdown
const typesInput = document.querySelector("#type-spec");
fillSelectElement(uniqTypes, typesInput);

function manageAttracionsSearch(id, searchValue) {
  attractionsList.childNodes.forEach((attractionCard) => {
    const visible = attractionCard.querySelector(id).textContent.toLowerCase().includes(searchValue);
    if (!visible) attractionCard.classList.add("hide");
  })
}

// Get search input from aside form
const asideForm = document.querySelector(".aside-specs");
asideForm.addEventListener("submit", (event) => {
  event.preventDefault();
  console.log("submitted");

  const form = document.querySelector(".aside-specs");
  const searchData = {
    searchInputData:    form.querySelector("#search-spec").value.toLowerCase(),
    locationInputData:  form.querySelector("#location-spec").value.toLowerCase(),
    typeInputData:      form.querySelector("#type-spec").value.toLowerCase(),
  }
  console.log(searchData.locationInputData)

  attractionsList.childNodes.forEach((attractionCard) => {
    attractionCard.classList.remove("hide");
  })

  manageAttracionsSearch(".attraction-name", searchData.searchInputData);
  manageAttracionsSearch(".attraction-loc", searchData.locationInputData);
  manageAttracionsSearch(".attraction-type", searchData.typeInputData);
});



/* ---SUBMIT DATA TO DATABASE--- */
// Get data from form
document.querySelector("#submit-btn").addEventListener("click", getFormData);
function getFormData() {
  const form = document.querySelector(".submit-form");
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