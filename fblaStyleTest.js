const attractionItemTemplate = document.querySelector("[attraction-item-template]");

fetch("https://jsonplaceholder.typicode.com/users")
  .then(res => res.json())
  .then(data => {
    data.forEach(user => {
      const item = attractionItemTemplate.content.cloneNode(true).children[0];
      const name = item.getElementById(/*name*/)"
      console.log(user);
  })
})