document.addEventListener('DOMContentLoaded', () => {
    // SPA View Router state elements
    const navItems = document.querySelectorAll('.nav-item');
    const appViews = document.querySelectorAll('.app-view');
    const currentLocationEl = document.getElementById('current-location');
    const refreshBtn = document.getElementById('btn-refresh');
    const leaderboardList = document.getElementById('leaderboard-list');

    // --- State Initialization and SPA Router Management ---
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetViewId = item.getAttribute('data-target');

            // Toggle Navigation Highlight Status
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            // Switch layout target container
            appViews.forEach(view => {
                if (view.id === targetViewId) {
                    view.classList.add('active-view');
                } else {
                    view.classList.remove('active-view');
                }
            });
        });
    });

    // --- Core Data Engine Engine ---
    async function fetchScoresData() {
        // Apply visual feedback spin animation to button
        refreshBtn.classList.add('spinning');
        const textNode = refreshBtn.querySelector('.btn-text');
        textNode.textContent = '🔄 Loading Live Data...';

        try {
            // Strict asset cache-busting to bypass GitHub Pages aggressive text asset caching
            const response = await fetch(`./scores.json?t=${new Date().getTime()}`);
            if (!response.ok) {
                throw new Error('Network response failure fetching tournament config matrix JSON.');
            }
            const data = await response.json();
            
            // Set App Context Window Headers
            currentLocationEl.textContent = `Current Location: ${data.current_hole || 'Unknown'}`;
            
            // Render calculations logic
            renderLeaderboard(data.teams);

        } catch (error) {
            console.error('Data Engine Error Event:', error);
            leaderboardList.innerHTML = `
                <div class="card" style="border-color: #E63946;">
                    <p style="color: #E63946; font-weight: bold;">⚠️ Error Syncing Leaderboard Data</p>
                    <p style="font-size: 0.85rem; margin-top: 4px;">Verify scores.json configuration matches the layout parameters schema completely.</p>
                </div>`;
        } finally {
            // Remove animation indicators cleanly
            setTimeout(() => {
                refreshBtn.classList.remove('spinning');
                textNode.textContent = '🔄 Refresh Live Scores';
            }, 600);
        }
    }

    // --- Leaderboard Calculation Logic & Engine DOM Rendering ---
    function renderLeaderboard(teamsArray) {
        // Transform incoming model structure into data entries containing dynamic sums
        const processedTeams = teamsArray.map(team => {
            const totalScore = Object.values(team.scores).reduce((sum, current) => sum + current, 0);
            return {
                ...team,
                totalScore: totalScore
            };
        });

        // Sorting rule logic: Low Score Wins (Standard Professional Ruleset alignment)
        processedTeams.sort((teamA, teamB) => teamA.totalScore - teamB.totalScore);

        // Wipe container nodes safely before element construction loop cycles
        leaderboardList.innerHTML = '';

        // Inject computed dynamic elements into main execution UI tree container layout
        processedTeams.forEach((team, index) => {
            const rankNumber = index + 1;
            
            // Outer Main Block Element Card Wrap
            const cardWrapper = document.createElement('div');
            cardWrapper.className = 'team-card-wrapper';

            // Top Content Row Block Layout
            const mainRow = document.createElement('div');
            mainRow.className = 'team-main-row';
            
            // Append explicit functional inline background colour hex mapping from static data source values
            mainRow.innerHTML = `
                <div class="team-rank">#${rankNumber}</div>
                <div class="team-color-strip" style="background-color: ${team.color || '#fff'};"></div>
                <div class="team-meta">
                    <div class="team-name">${team.name}</div>
                    <div class="team-players">${team.players.join(', ')}</div>
                </div>
                <div class="team-total-strokes">
                    ${team.totalScore}
                    <span class="strokes-label">Strokes</span>
                </div>
            `;

            // Expandable Dropdown Block Element Layout Structure Map
            const dropdown = document.createElement('div');
            dropdown.className = 'team-scorecard-dropdown';

            const scoreGrid = document.createElement('div');
            scoreGrid.className = 'score-grid';

            // Loop and unpack static structural pub properties to map row breakdown details dynamically
            Object.keys(team.scores).forEach(pubName => {
                const item = document.createElement('div');
                item.className = 'score-grid-item';
                item.innerHTML = `
                    <span class="pub-title">${pubName}</span>
                    <span class="pub-stroke-value">${team.scores[pubName] || 0}</span>
                `;
                scoreGrid.appendChild(item);
            });

            dropdown.appendChild(scoreGrid);
            cardWrapper.appendChild(mainRow);
            cardWrapper.appendChild(dropdown);

            // Accordion Interaction Toggling Execution Module Logic Engine
            mainRow.addEventListener('click', () => {
                dropdown.classList.toggle('expanded');
            });

            leaderboardList.appendChild(cardWrapper);
        });
    }

    // --- Action Event Trigger Attachments ---
    refreshBtn.addEventListener('click', fetchScoresData);

    // Bootstrap app on start
    fetchScoresData();
});
