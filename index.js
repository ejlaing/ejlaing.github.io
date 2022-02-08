// Import functions from https://www.gstatic.com/firebasejs/9.6.6/
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js';
import { 
  getFirestore, collection, getDocs,
  doc, setDoc, query, addDoc,
} from 'https://www.gstatic.com/firebasejs/9.6.6/firebase-firestore-lite.js';

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

// Write data to list
const attractionsList = document.getElementById("attractions-list");
function writeData(doc) {
  let li = document.createElement("li");
  let name = document.createElement("span");

  li.setAttribute("doc-id", doc.id);
  li.textContent = "Attractions: ";
  name.textContent = doc.data().name;

  li.appendChild(name);
  attractionsList.appendChild(li);
}

// Get data from firebase
const q = query(collection(db, "attractions"));
const querySnapshot = await getDocs(q);
querySnapshot.forEach((doc) => {
  writeData(doc);
  
});

// Add a new document in collection "attractions"
async function blahaba(newAttraction) {
  console.log("coolio\n");
  const docRef = await addDoc(collection(db, "attractions"), {
    name: 	newAttraction.name,
    location: 	newAttraction.location,
    zip: 	newAttraction.zip,
    rating: 	newAttraction.rating,
    isRestaurant: newAttraction.isRestaurant,
    hours: 	newAttraction.hours,
    description: newAttraction.description,
  });
  //console.log("Document written with ID: " + docRef.id + " and\n name: " + docRef.doc.data());
}

// Get data from form and add a document with it
var form = document.getElementById("add-doc-form");
const attraction = {
  name: "Andy's house",
  location: "Fontana-On-Geneva-Lake",
  zip: 53125,
  rating: 5.0,
  isRestaurant: false,
  hours: {openTime: "12:00am", closeTime: "12:00pm"},
  description: "Just a lovely home, innit!"
}
//blahaba(attraction);