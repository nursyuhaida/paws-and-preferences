const TOTAL_CATS = 10;
const container = document.getElementById("card-container");
const summary = document.getElementById("summary");
const likeCount = document.getElementById("like-count");
const likedCatsDiv = document.getElementById("liked-cats");

let currentIndex = 0;
let likedCats = [];
let cards = [];
function createCards() {
  for (let i = TOTAL_CATS - 1; i >= 0; i--) {
    const card = document.createElement("div");
    card.className = "card";
    card.style.backgroundImage = `url(https://cataas.com/cat?random=${i})`;

    addSwipe(card);
    container.appendChild(card);
    cards.push(card);
  }
}

createCards();
function addSwipe(card) {
  let startX = 0;
  let currentX = 0;

  card.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
  });

  card.addEventListener("touchmove", e => {
    currentX = e.touches[0].clientX - startX;
    card.style.transform = `translateX(${currentX}px) rotate(${currentX / 10}deg)`;
  });

  card.addEventListener("touchend", () => {
    if (currentX > 100) {
      like(card);
    } else if (currentX < -100) {
      dislike(card);
    } else {
      card.style.transform = "";
    }
  });
}
function like(card) {
  likedCats.push(card.style.backgroundImage);
  removeCard(card, "100vw");
}

function dislike(card) {
  removeCard(card, "-100vw");
}

function removeCard(card, direction) {
  card.style.transition = "transform 0.3s";
  card.style.transform = `translateX(${direction})`;

  setTimeout(() => {
    card.remove();
    currentIndex++;
    checkEnd();
  }, 300);
}
function checkEnd() {
  if (currentIndex === TOTAL_CATS) {
    container.classList.add("hidden");
    summary.classList.remove("hidden");

    likeCount.textContent = likedCats.length;

    likedCats.forEach(img => {
      const image = document.createElement("img");
      image.src = img.slice(5, -2); // remove url("")
      likedCatsDiv.appendChild(image);
    });
  }
}
