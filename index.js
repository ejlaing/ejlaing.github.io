import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js';
import { getFirestore, collection, getDocs, 
  query, addDoc, orderBy
} from 'https://www.gstatic.com/firebasejs/9.6.6/firebase-firestore-lite.js';

/*
---PREPARING DATABASE--- 
*/
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

/*
---DISPLAYING DATA---
*/
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

// Manage Search bar based on attraction name
function manageAttractionsSearch(id, searchValue) {
  attractionsList.childNodes.forEach((attractionCard) => {
    const visible = attractionCard.querySelector(id).textContent.toLowerCase().includes(searchValue);
    if (!visible) attractionCard.classList.add("hide");
  })
}

// Check which attractions are open based on current time
function checkOpenAttractions() {
  const currentTime = new Date();
  const currentMinutes = currentTime.getHours()*60 + currentTime.getMinutes();

  attractionsList.childNodes.forEach((attractionCard) => {
    // Turn Hours String ("10:00am - 2:00pm") into minutes (600, 840)
    const hoursString = attractionCard.querySelector(".attraction-hours").textContent;
    const openTimeString = hoursString.substr(0, 5).split(":");
    const closeTimeString = hoursString.substr(10, 5).split(":");;
    let openTimeMin = parseInt(openTimeString[0], 10)*60 + parseInt(openTimeString[1], 10);
    let closeTimeMin = parseInt(closeTimeString[0], 10)*60 + parseInt(closeTimeString[1], 10);
    // If the time had a "pm", add 12 hours to it (720 mins)
    const openInPM = (hoursString.substr(5, 2) === "pm" && openTimeString[0] != 12);
    const closeInPM = (hoursString.substr(15, 2) === "pm" && closeTimeString[0] != 12);
    if (openInPM) openTimeMin += 720;
    if (closeInPM) closeTimeMin += 720;

    const visible = (currentMinutes >= openTimeMin && currentMinutes <= closeTimeMin);

    if (!visible) attractionCard.classList.add("hide");
  })
}

// Only show attractions whose ratings have been selected
function manageRatings(ratingsChecked) {
  attractionsList.childNodes.forEach((attractionCard) => {
    const attractionRating = Math.floor(attractionCard.querySelector(".attraction-rating").textContent.substr(0, 3));
    let visible = (ratingsChecked[attractionRating - 1]);

    const someChecked = ratingsChecked.some((rating) => {return rating});
    if (!someChecked) visible = true;

    if (!visible) attractionCard.classList.add("hide");
  });
}

// Get search input from aside form
const asideForm = document.querySelector(".aside-specs");
asideForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const form = document.querySelector(".aside-specs");
  const searchData = {
    searchInputData:      form.querySelector("#search-spec").value.toLowerCase(),
    locationInputData:    form.querySelector("#location-spec").value.toLowerCase(),
    typeInputData:        form.querySelector("#type-spec").value.toLowerCase(),
    openInputDataChecked: form.querySelector("#is-open").checked,
    ratingsChecked: [
      form.querySelector("#rating-1").checked,
      form.querySelector("#rating-2").checked,
      form.querySelector("#rating-3").checked,
      form.querySelector("#rating-4").checked,
      form.querySelector("#rating-5").checked]
  }

  attractionsList.childNodes.forEach((attractionCard) => {
    attractionCard.classList.remove("hide");
  })

  manageAttractionsSearch(".attraction-name", searchData.searchInputData);
  manageAttractionsSearch(".attraction-loc", searchData.locationInputData);
  manageAttractionsSearch(".attraction-type", searchData.typeInputData);
  manageRatings(searchData.ratingsChecked);
  if (searchData.openInputDataChecked) checkOpenAttractions();
});