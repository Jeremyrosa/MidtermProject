const API_KEY = "9dacac3e3a9a76dda5da54c523c99bca";
const LEAGUE_ID = 253;
const SEASON = 2026;

let cachedMatches = [];
let currentTab = "all";
let countdownInterval = null;

/* Fetch Matches */
fetch(`https://v3.football.api-sports.io/fixtures?league=${LEAGUE_ID}&season=${SEASON}`, {
  headers: { "x-apisports-key": API_KEY }
})
.then(res => res.json())
.then(data => {
  cachedMatches = data.response;
  renderMatches();
});

/* Favorites */
function getFavorites() {
  return JSON.parse(localStorage.getItem("favorites")) || [];
}

function toggleFavorite(matchId, checked) {
  let favs = getFavorites();

  if (checked) {
    if (!favs.includes(matchId)) favs.push(matchId);
  } else {
    favs = favs.filter(id => id !== matchId);
  }

  localStorage.setItem("favorites", JSON.stringify(favs));
  renderMatches();
}

/* Tabs */
function switchTab(tab) {
  currentTab = tab;

  document.querySelectorAll(".tab").forEach(btn =>
    btn.classList.remove("active")
  );

  document
    .querySelector(`.tab[onclick="switchTab('${tab}')"]`)
    .classList.add("active");

  renderMatches();
}

/* Render Matches */
function renderMatches() {
  const list = document.getElementById("matches-list");
  const favorites = getFavorites();

  let matchesToRender = cachedMatches;

  if (currentTab === "favorites") {
    matchesToRender = cachedMatches.filter(m =>
      favorites.includes(m.fixture.id)
    );
  }

  list.innerHTML = "";

  if (matchesToRender.length === 0) {
    list.innerHTML = `<p class="empty">No matches to display</p>`;
    return;
  }

  matchesToRender.forEach(match => {
    const id = match.fixture.id;
    const checked = favorites.includes(id) ? "checked" : "";

    list.innerHTML += `
      <div class="match-row">
        <input type="checkbox"
               ${checked}
               onchange="toggleFavorite(${id}, this.checked)" />

        <span class="match-title">
          ${match.teams.home.name} vs ${match.teams.away.name}
        </span>

        <button class="view-btn" onclick="viewMatch(${id})">
          View
        </button>
      </div>
    `;
  });
}

/* View Matche Details */
function viewMatch(matchId) {
  const match = cachedMatches.find(m => m.fixture.id === matchId);
  if (!match) return;

  if (countdownInterval) clearInterval(countdownInterval);

  const details = document.getElementById("match-details");
  const kickoff = new Date(match.fixture.date);

  const date = kickoff.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  const time = kickoff.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  });

  details.innerHTML = `
    <div class="details-card">
      <h3>${match.teams.home.name} vs ${match.teams.away.name}</h3>

      <div class="teams">
        <div>
          <img src="${match.teams.home.logo}" alt="${match.teams.home.name}">
          <p>${match.teams.home.name}</p>
        </div>

        <div>
          <img src="${match.teams.away.logo}" alt="${match.teams.away.name}">
          <p>${match.teams.away.name}</p>
        </div>
      </div>

      <p><strong>Date:</strong> ${date}</p>
      <p><strong>Time:</strong> ${time}</p>
      <p><strong>Status:</strong> ${match.fixture.status.long}</p>

      <p class="score">
        ${match.goals.home ?? "-"} : ${match.goals.away ?? "-"}
      </p>

      <p class="countdown">
        Kickoff in: <span id="countdown-timer"></span>
      </p>
    </div>
  `;

  startCountdown(kickoff);
}

/* Countdown */
function startCountdown(kickoffTime) {
  const countdownEl = document.getElementById("countdown-timer");

  function updateCountdown() {
    const now = new Date();
    const diff = kickoffTime - now;

    if (diff <= 0) {
      countdownEl.textContent = "Kickoff has started!";
      clearInterval(countdownInterval);
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    countdownEl.textContent =
      `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }

  updateCountdown();
  countdownInterval = setInterval(updateCountdown, 1000);
}
