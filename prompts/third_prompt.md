AI Prompt & Development Specification: Mobile Pub Golf SPASystem Overview & ConstraintsArchitecture: Single Page Application (SPA) using view switching via JavaScript.Technology Stack: Pure HTML5, CSS3, and vanilla JavaScript (ES6+). No frameworks, no external CSS/JS libraries (except Google Fonts/FontAwesome icons if needed).Hosting Target: GitHub Pages (requires strict relative paths and static assets).Data Persistence: External scores.json file. No hardcoded scores, no localStorage.Design Target: Mobile-first responsive web design. Styled like a professional golf scorecard meets a vibrant, fun pub event.File Structuretext├── index.html
├── style.css
├── app.js
├── scores.json
└── assets/
    └── course-map.png  (Placeholder image for the layout)
Use code with caution.1. Data Schema (scores.json)The application must fetch its state from this exact JSON structure. Save this structure directly into scores.json:json{
  "current_hole": "Pear Tree (Hole 3)",
  "teams": [
    {
      "name": "Team Ruairidh",
      "color": "#E63946",
      "players": ["Ruairidh", "Cara", "Stuart", "Mel", "Matt"],
      "scores": {
        "Bar Salsa": 4,
        "Oz Bar": 3,
        "Pear Tree": 2,
        "Bennetts": 0,
        "Black Bird": 0,
        "Golf Tavern": 0
      }
    },
    {
      "name": "Team Charlie",
      "color": "#2A9D8F",
      "players": ["Charlie", "David", "McCann", "Amanda", "Joe"],
      "scores": {
        "Bar Salsa": 5,
        "Oz Bar": 4,
        "Pear Tree": 3,
        "Bennetts": 0,
        "Black Bird": 0,
        "Golf Tavern": 0
      }
    },
    {
      "name": "Team Rob",
      "color": "#F4A261",
      "players": ["Rob", "Euan", "Emma", "Jenny", "Jack"],
      "scores": {
        "Bar Salsa": 3,
        "Oz Bar": 5,
        "Pear Tree": 1,
        "Bennetts": 0,
        "Black Bird": 0,
        "Golf Tavern": 0
      }
    }
  ]
}
Use code with caution.2. UI Layout & Navigation (SPA)The layout must feature a fixed bottom navigation bar optimized for thumb reach on mobile screens.Fixed HeaderDisplays the title: "Pub Golf Championship 2026"Dynamically displays a sub-header: "Current Location: [current_hole]" parsed from the JSON.Fixed Bottom Navigation BarThree large, mobile-friendly buttons spanning the width of the screen:Leaderboard (Default view)Course MapRulebook3. Detailed Component & View LogicView 1: Leaderboard & Teams (Default)Refresh Scores Button: A prominent, full-width button at the top of this view. Clicking it triggers the JavaScript fetch('./scores.json') sequence again without reloading the browser tab. Include a brief "spinning" visual effect or text change during the fetch.Dynamic Leaderboard Card List:Calculates the total score for each team by summing their scores across all pubs.Sorting: Dynamically sorts the cards from lowest total score (1st place) to highest total score (last place).Each card features a prominent rank number (e.g., #1, #2), the Team Name, a visual tag using the team's assigned color, a comma-separated list of its players, and the total stroke count highlighted boldly.Clicking a team card expands it to reveal a mini-scorecard dropdown breaking down how many strokes they took at each individual pub.View 2: Course MapDisplays a clean container containing the static assets/course-map.png.The image must be fully responsive (max-width: 100%; height: auto;).Include a fallback, styled text list beneath the map showing the course order:Bar Salsa → 2. Oz Bar → 3. Pear Tree → 4. Bennetts → 5. Black Bird → 6. Golf Tavern.View 3: RulebookAn organized, highly readable scrollable text view broken down into the following cards:Schedule: Starts sharp at 7:00 PM.The Dress Code: Hawaiian shirts, shades, and golf gloves are mandatory. Cool golf caps are highly preferable but not essential.Core Rules:1 sip of a pint or sippable drink = 1 stroke.1 "sook" through a straw = 1 stroke. The stroke is counted the exact moment the straw leaves your lips.You must wear a golf glove at all times while actively drinking. Gloves can be swapped between teammates.Failing to finish a drink penalties your team with a heavy +2 strokes.A hole-in-one is achieved if a drink is finished in a single continuous sip/sook. Ties are permitted.Fair Play Drink Selection Guide:Bar Salsa (Par 5): Team Challenge! 1 pitcher of your choosing. 1 sook through a straw = 1 stroke.Oz Bar (Par 4): 1 pint of your personal preference.Pear Tree (Par 3): 1 VK bottle each. Bonus: Drink 1 shot alongside it to deduct 3 strokes (-3) from your team score!Bennetts (Par 5): Team Challenge! 2 Half & Halfs (2 Whiskies and 2 Half-Pints split among the team).Black Bird (Par 4): 1 pint of your personal preference.Golf Tavern (Par 3): 1 glass of bubbly.Prizes & Forfeits: (Leave a stylized placeholder card for the organizer to fill out later).4. CSS Design Guidelines (Modern & Punchy)Theme: Golf course green accents mixed with a clean, dark-mode night layout (e.g., deep charcoal background #121212, clean white cards #1E1E1E, vivid neon accents for text readouts).Typography: Clean sans-serif font stack (e.g., Inter, Roboto, or system-ui). Large, easily readable typography for screens viewed under pub lighting.Touch Targets: All buttons, cards, and nav items must have a minimum hit target of 48px x 48px to ensure smooth mobile use.No Scrollbars: Hide horizontal body overflow. Ensure smooth vertical scrolling on the active view container using -webkit-overflow-scrolling: touch;.
