// import functions from https://www.gstatic.com/firebasejs/9.6.6/
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js';
import { 
  getFirestore, collection, getDocs,
  doc, setDoc,
} from 'https://www.gstatic.com/firebasejs/9.6.6/firebase-firestore-lite.js';

// initialize and configure Firebase
const firebaseApp = initializeApp({
    apiKey: "AIzaSyBlItp1Kq3TZp1aije7m9HxPzQG12zI7mU",
    authDomain: "fbla-attractions.firebaseapp.com",
    projectId: "fbla-attractions",
    storageBucket: "fbla-attractions.appspot.com",
    messagingSenderId: "1051181314735",
    appId: "1:1051181314735:web:2726c20e1841bb19a41a5a"
});

// initialize database
const db = getFirestore(firebaseApp);

// reference attractions collection
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
function setNewDocument(newAttraction) {
  const docRef = await addDoc(collection(db, "attractions"), {
    name: 	newAttraction.name,
    location: 	newAttraction.location,
    zip: 	newAttraction.zip,
    rating: 	newAttraction.rating,
    isRestaurant: newAttraction.isRestaurant,
    hours: 	newAttraction.hours,
    description: newAttraction.description,
  });
  console.log("Document written with ID: " + docRef.id + " and\n name: " + docRef.doc.data);
}