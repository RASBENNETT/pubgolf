// HOLE SEED DATA CONFIGURATION
const HOLE_DETAILS = {
  1: "The Red Lion (Par 3)",
  2: "The Crown & Anchor (Par 4)",
  3: "The White Hart (Par 3)",
  4: "The Royal Oak (Par 5)",
  5: "The King's Arms (Par 4)",
  6: "The Black Horse (Par 3)",
  7: "The Ship Inn (Par 4)",
  8: "The Swan (Par 4)",
  9: "The Winchester (Par 5)"
};

// DEFAULT GAME STATE
const DEFAULT_STATE = {
  currentHole: 1,
  teams: [
    { id: 1, name: "The Alco-holics", color: "#ef4444", scores: 0 },
    { id: 2, name: "Par-Tee Animals", color: "#3b82f6", scores: 0 },
    { id: 3, name: "The Bogey Birds", color: "#10b981", scores: 0 },
    { id: 4, name: "Mulligan Mavericks", color: "#a855f7", scores: 0 }
  ]
};

// Global state object reference
let gameState = {};

/**
 * System State Synchronizers
 */
function initStorage() {
  const data = localStorage.getItem("pub_golf_state");
  if (data) {
    try {
      gameState = JSON.parse(data);
    } catch (e) {
      console.error("Malformed state found. Flushing storage.", e);
      gameState = JSON.parse(JSON.stringify(DEFAULT_STATE));
      saveToStorage();
    }
  } else {
    gameState = JSON.parse(JSON.stringify(DEFAULT_STATE));
    saveToStorage();
  }
}

function saveToStorage() {
  localStorage.setItem("pub_golf_state", JSON.stringify(gameState));
}

/**
 * Client-Side Router Component
 */
function router() {
  const params = new URLSearchParams(window.location.search);
  const page = params.get("page") || "teams";
  const isAdminAuthorized = params.get("admin") === "true" || page === "admin";

  // Control Visibility of global Admin Nav element
  const navAdmin = document.getElementById("nav-admin");
  if (isAdminAuthorized) {
    navAdmin.classList.remove("hidden");
  } else {
    navAdmin.classList.add("hidden");
  }

  // Reset active style status classes on navigation anchors
  document.querySelectorAll("nav a").forEach(link => {
    link.classList.remove("bg-gray-900", "text-emerald-400", "font-bold");
  });

  // Target Active Template Views
  document.querySelectorAll(".view-section").forEach(view => view.classList.remove("active"));

  if (page === "teams") {
    document.getElementById("view-teams").classList.add("active");
    document.getElementById("nav-teams").classList.add("bg-gray-900", "text-emerald-400", "font-bold");
    renderTeamsPage();
  } else if (page === "map") {
    document.getElementById("view-map").classList.add("active");
    document.getElementById("nav-map").classList.add("bg-gray-900", "text-emerald-400", "font-bold");
  } else if (page === "admin") {
    if (isAdminAuthorized) {
      document.getElementById("view-admin").classList.add("active"); document.getElementById("nav-admin").classList.add("bg-amber-500", "text-white"); renderAdminPage();
    } else { document.getElementById("view-denied").classList.add("active"); }
  } else {
    // Fallback route handling
    document.getElementById("view-teams").classList.add("active"); renderTeamsPage();
  }
}


/*** View Rendering Engines*/
function renderTeamsPage() {
  // Update Active Hole Banner Element
  const activeHoleStr = HOLE_DETAILS[gameState.currentHole] || `Hole ${gameState.currentHole}`;
  document.getElementById("active-hole-banner-text").innerText = `Hole ${gameState.currentHole} — ${activeHoleStr}`;
  // Process deep-copy state slice for sort validation
  const sortedTeams = [...gameState.teams].sort((a, b) => a.scores - b.scores);
  const gridContainer = document.getElementById("leaderboard-grid"); gridContainer.innerHTML = ""; sortedTeams.forEach((team, index) => {
    const card = document.createElement("div"); card.className = "bg-gray-800 border border-gray-700 rounded-xl p-5 flex items-center justify-between shadow transition duration-200 hover:border-gray-600";
    // Rank Styling Determinations
    let rankBadge = "<span class=\"text-xs bg-gray-700 text-gray-300 font-bold px-2 py-1 rounded\">#${index + 1}</span>"; if (index === 0) rankBadge = "<span class=\"text-xs bg-amber-500 text-gray-900 font-black px-2 py-1 rounded shadow-sm\">🏆 1st</span>"; card.innerHTML = `<div class="flex items-center space-x-3 min-w-0"> <div class="w-4 h-10 rounded-md shrink-0 shadow-inner" style="background-color: ${team.color}"></div> <div class="min-w-0"> <div class="flex items-center space-x-2 mb-0.5"> ${rankBadge} </div> <h4 class="font-bold text-white text-lg truncate">${team.name}</h4> </div> </div> <div class="text-right shrink-0"> <p class="text-xs text-gray-400 uppercase tracking-wider font-semibold">Strokes</p> <p class="text-3xl font-black text-emerald-400">${team.scores}</p> </div>`;
    gridContainer.appendChild(card);
  });
} function renderAdminPage() {
  //Populate selector field logic for holes
  const selectEl = document.getElementById("admin-hole-select"); selectEl.innerHTML = "";
  for (let i = 1; i <= 9; i++) {
    const opt = document.createElement("option");

    opt.value = i;
    opt.innerText = `Hole ${i} (${HOLE_DETAILS[i].split(' (')[0]})`;

    if (i === Number(gameState.currentHole)) opt.selected = true; selectEl.appendChild(opt);
  }

  // Populate roster settings fields template mapping loop
  const scoreGrid = document.getElementById("admin-score-grid");
  scoreGrid.innerHTML = "";
  gameState.teams.forEach(team => {
    const row = document.createElement("div");
    row.className = "bg-gray-900 border border-gray-700 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between";
    row.innerHTML = `Score Controls-+`; scoreGrid.appendChild(row);
  });
}
/*** Global Interface Control Action Methods*/
window.adjustStroke = function (teamId, delta) {
  const input = document.getElementById(`stroke - input - ${teamId}`); if (input) {
    let val = parseInt(input.value, 10) || 0; val += delta; if (val < 0) val = 0;
    // Constraint rule tracking bounds validation
    input.value = val;
  }
};

function commitAdminChanges() {
  // Synchronize Active Hole Configuration
  const selectEl = document.getElementById("admin-hole-select");
  gameState.currentHole = parseInt(selectEl.value, 10) || 1;
  // Extract values out of DOM reference fields mapping keys
  const nameInputs = document.querySelectorAll(".admin-team-name");
  nameInputs.forEach(input => {
    const id = parseInt(input.getAttribute("data-team-id"), 10);
    const targetTeam = gameState.teams.find(t => t.id === id);
    if (targetTeam) targetTeam.name = input.value.trim() || targetTeam.name;
  });
  const colorInputs = document.querySelectorAll(".admin-team-color");

  colorInputs.forEach(input => {
    const id = parseInt(input.getAttribute("data-team-id"), 10);
    const targetTeam = gameState.teams.find(t => t.id === id); if (targetTeam) targetTeam.color = input.value;
  });
  gameState.teams.forEach(team => { const inputEl = document.getElementById(`stroke - input - ${team.id}`); if (inputEl) { team.scores = parseInt(inputEl.value, 10) || 0; } });
  // Write modified parameters sequence states down to local 
  databasesaveToStorage(); alert("Changes successfully committed to persistent storage!");
  // Re-route clean viewport back to Teams Leaderboard
  window.location.search = "?page=teams";
}

function resetGameSequence() {
  const confirmed = confirm("Are you completely sure you want to flush all custom score inputs back to defaults?"); if (confirmed) {
    localStorage.removeItem("pub_golf_state");
    initStorage();
    alert("Game state purged."); window.location.search = "?page=teams";
  }
}
// Intercept standard local anchor tag updates to route query states natively
document.querySelectorAll("nav a, #view-denied a").forEach(anchor => { anchor.addEventListener("click", function (e) { const href = this.getAttribute("href"); if (href && href.startsWith("?")) { e.preventDefault(); window.history.pushState({}, "", href); router(); } }); });
// Track global browser navigation action events
window.addEventListener("popstate", router);
// Core execution sequence setup
document.getElementById("btn-save").addEventListener("click", commitAdminChanges); document.getElementById("btn-reset").addEventListener("click", resetGameSequence);
