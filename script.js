// ================= SAMPLE DATA =================
// This is an array. Each object inside it is one animal post.

const defaultPosts = [
  {
    id: 1,
    title: "Hungry dog near DIT gate",
    type: "Dog",
    location: "DIT University Gate",
    condition: "Hungry",
    contact: "9999999999",
    imageUrl: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=900&q=80",
    description: "A friendly dog is usually seen near the tea stall. It needs food and care."
  },
  {
    id: 2,
    title: "Cat available for adoption",
    type: "Cat",
    location: "Rajpur Road",
    condition: "Healthy",
    contact: "9999999999",
    imageUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=900&q=80",
    description: "A calm and friendly cat is looking for a safe home."
  },
  {
    id: 3,
    title: "Injured puppy near Prem Nagar",
    type: "Puppy",
    location: "Prem Nagar",
    condition: "Injured",
    contact: "9999999999",
    imageUrl: "https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?auto=format&fit=crop&w=900&q=80",
    description: "Small puppy is limping and needs medical help."
  }
];

// ================= SELECT HTML ELEMENTS =================

const feedGrid = document.getElementById("feedGrid");
const postForm = document.getElementById("postForm");
const searchInput = document.getElementById("searchInput");
const typeFilter = document.getElementById("typeFilter");
const logoMeow = document.getElementById("logoMeow");
const themeBtn = document.getElementById("themeBtn");
const themeText = document.querySelector(".theme-text");

// ================= LOCAL STORAGE =================
// localStorage saves data in the browser.
// If saved posts exist, use them. Otherwise, use default sample posts.

let posts = JSON.parse(localStorage.getItem("nekoinudoonPosts")) || defaultPosts;

function savePosts() {
  localStorage.setItem("nekoinudoonPosts", JSON.stringify(posts));
}

// ================= DISPLAY POSTS =================
// This function prints posts on the page.

function displayPosts(postArray) {
  feedGrid.innerHTML = "";

  postArray.forEach(function (post) {
    const card = document.createElement("div");
    card.className = "animal-card";

    card.innerHTML = `
      <img src="${post.imageUrl}" alt="${post.title}">

      <div class="card-content">
        <h3>${post.title}</h3>
        <p><strong>Type:</strong> ${post.type}</p>
        <p><strong>Location:</strong> ${post.location}</p>
        <p><strong>Condition:</strong> ${post.condition}</p>
        <p>${post.description}</p>

        <div class="card-buttons">
          <button class="small-btn" onclick="showContact('${post.contact}')">Contact</button>
          <button class="small-btn delete-btn" onclick="deletePost(${post.id})">Delete</button>
        </div>
      </div>
    `;

    feedGrid.appendChild(card);
  });
}

// ================= ADD NEW POST =================
// This runs when the user submits the form.

postForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const newPost = {
    id: Date.now(),
    title: document.getElementById("title").value,
    type: document.getElementById("animalType").value,
    location: document.getElementById("location").value,
    condition: document.getElementById("condition").value,
    imageUrl:
      document.getElementById("imageUrl").value ||
      "https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=900&q=80",
    contact: document.getElementById("contact").value,
    description: document.getElementById("description").value
  };

  posts.unshift(newPost);
  savePosts();
  displayPosts(posts);
  postForm.reset();
  showToast("Post added successfully!");
});

// ================= SEARCH AND FILTER =================

function filterPosts() {
  const searchText = searchInput.value.toLowerCase();
  const selectedType = typeFilter.value;

  const filteredPosts = posts.filter(function (post) {
    const matchesSearch =
      post.title.toLowerCase().includes(searchText) ||
      post.location.toLowerCase().includes(searchText);

    const matchesType =
      selectedType === "all" || post.type === selectedType;

    return matchesSearch && matchesType;
  });

  displayPosts(filteredPosts);
}

searchInput.addEventListener("input", filterPosts);
typeFilter.addEventListener("change", filterPosts);

// ================= CONTACT BUTTON =================

function showContact(number) {
  alert("Contact number: " + number);
}

// ================= DELETE POST =================

function deletePost(id) {
  const confirmDelete = confirm("Do you want to delete this post?");

  if (confirmDelete) {
    posts = posts.filter(function (post) {
      return post.id !== id;
    });

    savePosts();
    displayPosts(posts);
    showToast("Post deleted!");
  }
}

// ================= TOAST MESSAGE =================

function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;

  document.body.appendChild(toast);

  setTimeout(function () {
    toast.remove();
  }, 2000);
}

// ================= LOGO MEOW SOUND FEATURE =================
// This is an extra fun feature.
// It uses Web Audio API to create a small meow-like sound without using any audio file.

function playMeowSound() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;

  if (!AudioContext) {
    return;
  }

  const audioContext = new AudioContext();

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.type = "sine";

  // Pitch starts high, goes low, then high again.
  oscillator.frequency.setValueAtTime(650, audioContext.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(420, audioContext.currentTime + 0.18);
  oscillator.frequency.exponentialRampToValueAtTime(720, audioContext.currentTime + 0.35);

  // Volume starts low, becomes audible, then fades out.
  gainNode.gain.setValueAtTime(0.001, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.15, audioContext.currentTime + 0.04);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.45);

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.45);
}

logoMeow.addEventListener("click", function () {
  playMeowSound();
  showToast("Nya~ 🐱");
});

// ================= NIGHT MODE FEATURE =================
// This changes the website theme by adding/removing a CSS class on body.

const savedTheme = localStorage.getItem("nekoinudoonTheme");

if (savedTheme === "dark") {
  document.body.classList.add("dark-theme");
  themeText.textContent = "Day";
}

themeBtn.addEventListener("click", function () {
  document.body.classList.toggle("dark-theme");

  if (document.body.classList.contains("dark-theme")) {
    themeText.textContent = "Day";
    localStorage.setItem("nekoinudoonTheme", "dark");
    showToast("Black cat night mode on 🐈‍⬛");
  } else {
    themeText.textContent = "Night";
    localStorage.setItem("nekoinudoonTheme", "light");
    showToast("Day mode on ☀️");
  }
});

// ================= INITIAL DISPLAY =================

displayPosts(posts);
