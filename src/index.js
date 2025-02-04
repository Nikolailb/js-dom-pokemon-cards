function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
function getNonNullLinks(obj) {
  let links = [];

  function traverse(obj) {
    for (const key in obj) {
      if (obj[key] && typeof obj[key] === "object") {
        traverse(obj[key]); // Recursively traverse nested objects
      } else if (typeof obj[key] === "string" && obj[key].startsWith("http")) {
        links.push(obj[key]); // Collect non-null links
      }
    }
  }

  traverse(obj);
  return links;
}

const cardList = document.querySelector(".cards");
for (const cardData in data) {
  let card = document.createElement("li");
  card.className = "card";
  // Just generate simple elements directly
  card.innerHTML = `
        <h2 class="card--title">${capitalize(data[cardData].name)}</h2>
        <img 
            width="256"
            class="card--img"
            src="${
              data[cardData].sprites.other["official-artwork"].front_default
            }" alt="${data[cardData].name}">
    `;

  // Toggle between different sprites on click, just using every non-null sprite link.
  card.querySelector(".card--img").addEventListener("click", () => {
    let sprites = [...new Set(getNonNullLinks(data[cardData].sprites))];
    let index = sprites.indexOf(card.querySelector(".card--img").src);
    index = (index + 1) % sprites.length;
    card.querySelector(".card--img").src = sprites[index];
  });

  // Handling stats
  let stats = document.createElement("ul");
  stats.className = "card--text";
  data[cardData].stats.forEach((stat) => {
    let statItem = document.createElement("li");
    statItem.innerText = `${stat.stat.name.toUpperCase()}: ${stat.base_stat}`;
    stats.appendChild(statItem);
  });

  // Hides the games for prettier presentation
  let toggleButton = document.createElement("button");
  toggleButton.className = "toggle-button";
  toggleButton.innerText = "Show Games";

  // Container for hidden content
  let gameListContainer = document.createElement("div");
  gameListContainer.className = "hidden-content";

  // Actaul hidden content
  let gameList = document.createElement("div");
  gameList.innerText = data[cardData].game_indices
    .map((game) => capitalize(game.version.name))
    .join(", ");

  gameListContainer.appendChild(gameList);

  // Add event listener for the button
  toggleButton.addEventListener("click", function () {
    gameListContainer.classList.toggle("show");
    toggleButton.innerText = gameListContainer.classList.contains("show")
      ? "Hide Games"
      : "Show Games";
  });

  card.appendChild(stats);
  card.appendChild(toggleButton);
  card.appendChild(gameListContainer);
  cardList.appendChild(card);
}
