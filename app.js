const attractionList = document.querySelector("#attractions-list");

// Get data and turn it into HTML elements
function renderAttractions(doc) {
    let li = document.createElement("li");
    let name = document.createElement("span");
    let rating = document.createElement("span");
    let location = document.createElement("span");

    li.setAttribute("doc-id", doc.id);
    name.textContent = doc.data().name;
    rating.textContent = doc.data().rating;
    location.textContent = "Your mom's house";

    li.appendChild(name);
    li.appendChild(rating);
    attractionList.appendChild(li);
}


myDatabase.collection("attractions").get().then((snapshot) =>{
    snapshot.docs.forEach(doc => {
        renderAttractions(doc)
    })
})