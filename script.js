// ===============================
// CODEBUDDY NOTES - script.js
// ===============================

// Local Storage Keys
const NOTES_KEY = "codebuddy_notes";
const FAV_KEY = "codebuddy_favorites";
const THEME_KEY = "codebuddy_theme";

// Elements
const generateBtn = document.getElementById("generateBtn");
const notesContainer = document.getElementById("notesContainer");
const favoritesContainer = document.getElementById("favoritesContainer");
const recentContainer = document.getElementById("recentContainer");

const languageInput = document.getElementById("language");
const topicInput = document.getElementById("topic");

const totalNotesEl = document.getElementById("totalNotes");
const favoriteCountEl = document.getElementById("favoriteCount");
const recentCountEl = document.getElementById("recentCount");

const searchInput = document.getElementById("searchInput");
const themeToggle = document.getElementById("themeToggle");

// ===============================
// LOAD DATA
// ===============================

let notes = JSON.parse(localStorage.getItem(NOTES_KEY)) || [];
let favorites = JSON.parse(localStorage.getItem(FAV_KEY)) || [];

// ===============================
// THEME
// ===============================

function loadTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);

    if (savedTheme === "dark") {
        document.body.classList.add("dark");
        themeToggle.textContent = "☀️ Light Mode";
    }
}

loadTheme();

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    const isDark = document.body.classList.contains("dark");

    localStorage.setItem(
        THEME_KEY,
        isDark ? "dark" : "light"
    );

    themeToggle.textContent = isDark
        ? "☀️ Light Mode"
        : "🌙 Dark Mode";
});

// ===============================
// SAVE
// ===============================

function saveNotes() {
    localStorage.setItem(
        NOTES_KEY,
        JSON.stringify(notes)
    );
}

function saveFavorites() {
    localStorage.setItem(
        FAV_KEY,
        JSON.stringify(favorites)
    );
}

// ===============================
// GENERATE NOTES
// ===============================

generateBtn.addEventListener("click", () => {

    const language = languageInput.value.trim();
    const topic = topicInput.value.trim();

    if (!language || !topic) {
        alert("Please select language and topic.");
        return;
    }

    const note = {
        id: Date.now(),
        language,
        topic,
        content: `
Definition:
${topic} is an important concept in ${language}.

Syntax:
Basic syntax depends on implementation.

Example:
Example code for ${topic} in ${language}.

Output:
Expected output of the program.

Real Life Example:
Used in software development projects.

Important Points:
• Easy to learn
• Frequently asked in interviews

Best Practices:
• Write clean code
• Follow coding standards
        `,
        createdAt: new Date().toLocaleString()
    };

    notes.unshift(note);

    saveNotes();

    renderNotes();
    updateStats();

    topicInput.value = "";
});

// ===============================
// RENDER NOTES
// ===============================

function renderNotes(filteredNotes = notes) {

    notesContainer.innerHTML = "";

    filteredNotes.forEach(note => {

        const card = document.createElement("div");

        card.className = "note-card";

        card.innerHTML = `
            <h3>${note.topic}</h3>

            <p><strong>Language:</strong>
            ${note.language}</p>

            <p>${note.content}</p>

            <small>${note.createdAt}</small>

            <div class="note-actions">

                <button
                    class="favorite-btn"
                    onclick="addFavorite(${note.id})">
                    ⭐ Favorite
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteNote(${note.id})">
                    Delete
                </button>

            </div>
        `;

        notesContainer.appendChild(card);
    });

    renderRecent();
}

// ===============================
// FAVORITES
// ===============================

function addFavorite(id) {

    const note = notes.find(
        n => n.id === id
    );

    if (!note) return;

    const exists = favorites.find(
        f => f.id === id
    );

    if (exists) {
        alert("Already in favorites.");
        return;
    }

    favorites.push(note);

    saveFavorites();

    renderFavorites();

    updateStats();
}

function removeFavorite(id) {

    favorites = favorites.filter(
        note => note.id !== id
    );

    saveFavorites();

    renderFavorites();

    updateStats();
}

function renderFavorites() {

    favoritesContainer.innerHTML = "";

    favorites.forEach(note => {

        const card = document.createElement("div");

        card.className = "note-card";

        card.innerHTML = `
            <h3>${note.topic}</h3>

            <p>
            ${note.language}
            </p>

            <div class="note-actions">

                <button
                class="delete-btn"
                onclick="removeFavorite(${note.id})">
                Remove
                </button>

            </div>
        `;

        favoritesContainer.appendChild(card);
    });
}

// ===============================
// DELETE NOTE
// ===============================

function deleteNote(id) {

    if (!confirm("Delete note?"))
        return;

    notes = notes.filter(
        note => note.id !== id
    );

    favorites = favorites.filter(
        note => note.id !== id
    );

    saveNotes();
    saveFavorites();

    renderNotes();
    renderFavorites();
    updateStats();
}

// ===============================
// RECENT NOTES
// ===============================

function renderRecent() {

    recentContainer.innerHTML = "";

    const recent = [...notes].slice(0, 5);

    recent.forEach(note => {

        const card = document.createElement("div");

        card.className = "note-card";

        card.innerHTML = `
            <h3>${note.topic}</h3>
            <p>${note.language}</p>
            <small>${note.createdAt}</small>
        `;

        recentContainer.appendChild(card);
    });
}

// ===============================
// SEARCH
// ===============================

searchInput.addEventListener("input", e => {

    const query = e.target.value
        .toLowerCase();

    const filtered = notes.filter(note =>
        note.topic.toLowerCase().includes(query)
        ||
        note.language.toLowerCase().includes(query)
    );

    renderNotes(filtered);
});

// ===============================
// STATS
// ===============================

function updateStats() {

    totalNotesEl.textContent =
        notes.length;

    favoriteCountEl.textContent =
        favorites.length;

    recentCountEl.textContent =
        Math.min(notes.length, 5);
}

// ===============================
// INITIAL LOAD
// ===============================

renderNotes();
renderFavorites();
updateStats();