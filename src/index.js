// import functions from https://www.gstatic.com/firebasejs/9.6.6/
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js';
import { getFirestore, collection, getDocs, query, limit,
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

const attractions = collection(db, 'attractions');

// query function to retrieve data
async function documentsQuery() {
    const attractionsQuery = query(
        // Specify more for query
        collection(db, 'attractions'),
        limit(20),
    );

    const querySnapshot = await getDocs(attractionsQuery);
    const allDocs = querySnapshot.forEach((snapshot) => {
        console.log(snapshot.data());
    })
}

documentsQuery();