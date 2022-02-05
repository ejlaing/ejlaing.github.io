const attractionList = document.querySelector("#attractions-list");

// Get data and turn it into HTML elements
function renderAttractions(doc) {
    let list = document.createElement("li");
    let name = document.createElement("span");
    let rating = document.createElement("span");

    list.setAttribute("doc-id", doc.id);
    name.textContent = doc.data().name;
    rating.textContent = doc.data().rating;

    list.appendChild(name);
    list.appendChild(rating);
    attractionList.appendChild(list);
}


myDatabase.collection("attractions").get().then((snapshot) =>{
    snapshot.docs.forEach(doc => {
        renderAttractions(doc)
    })
})