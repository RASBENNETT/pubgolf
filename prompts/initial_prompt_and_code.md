
You are going to help build a simple website for a pub golf party.

For ease of construction and hosting it shall only be html, css, and js, made for deployment on GitHub pages - so keep these constraints in mind.

It should be a single page application designed for use on a mobile browser

The pages should be: 
 - teams page
   - who’s playing with who(and their colour) 
   - their stroke count (score) in leaderboard style
 - course map (static image) showing which pub 
 - a rules page explaining what to do
   - how scoring works
   - how drunk selection can work at each pub based on personal preference whilst still keeping a fair playing field
   - prizes and forfeits 
   - dress code
 - an admin page that only I can access so that I can update which hole we’re on and each teams scores 

With the the admin page: you can’t do routing in gh pages as far as I know unless this could possibly be on a different route with a different index.html for example) 

Can you create me a specification for this so that I might then give that spec to a Gemini ai model to generate the source code please





PROMPT

Prompt for Code Generation: Pub Golf Single Page Application

Objective
Create a single-file, responsive Single Page Application (SPA) for a "Pub Golf" event. The website must be built using only HTML5, CSS3 (Tailwind CSS via CDN), and vanilla JavaScript. It must run completely client-side to be hosted on GitHub Pages. 

Architecture & State Constraints
* Single File Structure: Combine all HTML, CSS, and JS into a single index.html file.
* Client-Side Routing: Use URL query parameters (e.g., ?page=teams, ?page=map, ?page=admin) to switch views.
* Persistent Storage: Use localStorage to save and retrieve game state data so updates persist across page refreshes.
* Initial Seed Data: If localStorage is empty, initialize the app with 4 dummy teams, 9 blank holes, and a default active hole (Hole 1). 

Component Specifications

1. Navigation Bar
* Fixed to the top of the viewport.
* Clean, modern look with a title on the left ("Pub Golf Tracker") and navigation links on the right.
* Links: Teams, Course Map.
* Hidden Link: The Admin link must be invisible by default. It should only appear if the URL contains a special passkey parameter (e.g., ?admin=true or ?page=admin).

2. View 1: Teams Page (?page=teams)
* Active Hole Banner: A prominent alert bar at the top displaying the current hole numbers and pub name (e.g., "⛳ Current Hole: Hole 3 - The Red Lion").
* Leaderboard Grid: A responsive grid or list displaying all teams.
* Team Cards: Each card must show:
    * Team Name.
    * A clear visual background color or badge matching that team's designated colour.
    * Total Stroke Count (Current Score).
* Sorting: Automatically sort teams from lowest score (1st place) to highest score.

3. View 2: Course Map Page (?page=map)
* Displays a full-width static image placeholder for the course scorecard/map.
* Use a clean Unsplash placeholder image URL for the source code, which can easily be replaced later with a local asset path (e.g., images/map.jpg).
* Ensure the image scales responsively and fits well on mobile screens.

4. View 3: Admin Page (?page=admin)
* Access Control: This view should only render if the URL contains ?page=admin. If a user types it without permission, show an "Access Denied" message.
* Global Game Control:
    * A dropdown selector to change the "Current Active Hole" (Holes 1 through 9).
* Score Management Grid:
    * A table or card layout listing each team.
    * Inputs to edit the Team Name and select their Team Colour.
    * Plus (+) and Minus (-) buttons next to each team's total score input to quickly increment or decrement strokes.
* Action Buttons:
    * A "Save Changes" button that commits the updated scores and active hole to localStorage.
    * A "Reset Game" button (with a confirmation prompt) to clear all scores.

Technical & Styling Requirements
* Styling Framework: Use Tailwind CSS loaded via CDN for rapid utility styling.
* Mobile-First Design: The application must be fully optimized for mobile browsers, as users will look at it on their phones during the event. Use large, tap-friendly buttons.
* JavaScript State Object: Maintain a global state object structured like this:

javascript
let gameState = {
  currentHole: 1,
  teams: [
    { id: 1, name: "The Alco-holics", color: "#ef4444", scores: 0 },
    { id: 2, name: "Par-Tee Animals", color: "#3b82f6", scores: 0 }
  ]
};

Deliverable Expected
Provide a single, production-ready index.html file containing clean, commented, and semantic code. Include the complete script block handling the query parameter routing logic and localStorage synchronization.


<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pub Golf Tracker</title>
  <!-- Tailwind CSS CDN -->
  <script src="https://jsdelivr.net"></script>
  <style>
    /* Smooth transition for view switching */
    .view-section {
      display: none;
    }

    .view-section.active {
      display: block;
    }
  </style>
</head>

<body class="bg-gray-900 text-gray-100 font-sans min-h-screen pt-16 pb-8">

  <!-- 1. NAVIGATION BAR -->
  <nav class="fixed top-0 left-0 right-0 h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4 z-50 shadow-md">
    <div class="flex items-center space-x-2">
      <span class="text-xl font-bold tracking-tight text-emerald-400">🍺 Pub Golf Tracker</span>
    </div>
    <div class="flex items-center space-x-1 sm:space-x-2 text-sm font-medium">
      <a href="?page=teams" id="nav-teams" class="px-3 py-2 rounded-md hover:bg-gray-700 transition">Teams</a>
      <a href="?page=map" id="nav-map" class="px-3 py-2 rounded-md hover:bg-gray-700 transition">Course Map</a>
      <a href="?page=admin" id="nav-admin" class="hidden px-3 py-2 rounded-md bg-amber-600 hover:bg-amber-500 text-white transition">Admin Panel</a>
    </div>
  </nav>

  <!-- MAIN CONTAINER -->
  <main class="max-w-4xl mx-auto px-4 mt-6">

    <!-- ACCESS DENIED VIEW -->
    <div id="view-denied" class="view-section text-center py-12">
      <div class="bg-red-900/30 border border-red-500 rounded-lg p-6 max-w-md mx-auto">
        <span class="text-4xl">🚫</span>
        <h2 class="text-2xl font-bold text-red-400 mt-2">Access Denied</h2>
        <p class="text-gray-400 mt-1">You do not have the required passkey parameters to access the Admin Panel.</p>
        <a href="?page=teams" class="mt-4 inline-block bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-md transition text-sm">Return to Teams</a>

