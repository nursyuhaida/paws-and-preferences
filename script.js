// DOM Elements
const container = document.getElementById("card-container");
const app = document.querySelector(".app");
const overlay = document.getElementById("overlay");
const overlayBtn = document.getElementById("overlay-btn");
const overlayTitle = document.getElementById("overlay-title");
const overlayText = document.getElementById("overlay-text");
const summary = document.getElementById("summary");
const likeCount = document.getElementById("like-count");
const likedCatsDiv = document.getElementById("liked-cats");
const restartBtn = document.getElementById("restart-btn");

// Variables
const TOTAL_CATS = 10;
let currentIndex = 0;
let likedCats = [];
let cards = [];
let overlayStep = 0;

// Overlay logic
overlayBtn.addEventListener("click", () => {
  overlayStep++;
  if (overlayStep === 1) {
    overlayTitle.textContent = "How it works 👆";
    overlayText.innerHTML = `
      👉 Swipe <strong>right</strong> to Like ❤️ <br>
      👈 Swipe <strong>left</strong> to Dislike ❌
    `;
  } else {
    overlay.style.display = "none";
    createCards();
  }
});

// Create cards
function createCards() {
  container.innerHTML = "";
  cards = [];
  currentIndex = 0;
  likedCats = [];

  for (let i = TOTAL_CATS - 1; i >= 0; i--) {
    const card = document.createElement("div");
    card.className = "card";
    card.style.backgroundImage = `url(https://cataas.com/cat?random=${i})`;

    const emoji = document.createElement("div");
    emoji.className = "swipe-emoji";
    card.appendChild(emoji);

    addSwipe(card);
    container.appendChild(card);
    cards.push(card);
  }
}

// Unified swipe (touch + mouse)
function addSwipe(card) {
  let startX = 0;
  let currentX = 0;
  let isDragging = false;
  const emoji = card.querySelector(".swipe-emoji");

  // Touch
  card.addEventListener("touchstart", e => startX = e.touches[0].clientX);
  card.addEventListener("touchmove", e => handleMove(e.touches[0].clientX));
  card.addEventListener("touchend", endSwipe);

  // Mouse
  card.addEventListener("mousedown", e => {
    isDragging = true;
    startX = e.clientX;
  });

  document.addEventListener("mousemove", e => {
    if (!isDragging) return;
    handleMove(e.clientX);
  });

  document.addEventListener("mouseup", () => {
    if (!isDragging) return;
    isDragging = false;
    endSwipe();
  });

  function handleMove(x) {
    currentX = x - startX;
    card.style.transform = `translateX(${currentX}px) rotate(${currentX / 10}deg)`;

    if (currentX > 0) {
      emoji.textContent = "❤️";
      emoji.className = "swipe-emoji like";
      emoji.style.opacity = Math.min(currentX / 100, 1);
    } else {
      emoji.textContent = "❌";
      emoji.className = "swipe-emoji dislike";
      emoji.style.opacity = Math.min(Math.abs(currentX) / 100, 1);
    }
  }

  function endSwipe() {
    emoji.style.opacity = 0;
    if (currentX > 120) like(card);
    else if (currentX < -120) dislike(card);
    else card.style.transform = "";
    currentX = 0;
  }
}

// Like / Dislike
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

// Check end
function checkEnd() {
  if (currentIndex === TOTAL_CATS) {
    app.classList.add("hidden");
    summary.classList.remove("hidden");

    likeCount.textContent = likedCats.length;
    likedCatsDiv.innerHTML = "";

    likedCats.forEach(img => {
      const image = document.createElement("img");
      image.src = img.slice(5, -2);
      likedCatsDiv.appendChild(image);
    });
  }
}

// Restart button
restartBtn.addEventListener("click", () => {
  summary.classList.add("hidden");
  app.classList.remove("hidden");
  createCards();
});
