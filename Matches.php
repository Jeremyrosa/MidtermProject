<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>MatchHub - MLS Matches</title>
    
    <link rel="stylesheet" href="common.css">
    <link rel="stylesheet" href="Matches.css">

    <script defer src="Matches.js"></script>
</head>
<body>

<header>
    <nav class="navbar">
        <a href="index.html" class="logo">Match Hub</a>
        <ul class="nav-links">
            <li><a href="teamPage.html">TEAMS</a></li>
            <li><a href="leaderBoard.html">LEADERBOARD</a></li>
            <li><a href="Matches.php">MATCHES</a></li>
        </ul>
        <input type="text" class="search-bar" placeholder="Search..." />
    </nav>
</header>

    <div class="page-container">

        <!-- Left side: Match lists/Favorites -->
        <div class="left-panel">
            <div class="tabs">
                <button class="tab active" onclick="switchTab('all')">All</button>
                <button class="tab" onclick="switchTab('favorites')">Favorites</button>
            </div>

            <div id="matches-list"></div>
        </div>

        <!-- Right side: Match Details -->
        <div class="right-panel">
            <h2>Match Details</h2>
            <div id="match-details">
                <p class="placeholder">Click "View" to see match details</p>
            </div>
        </div>
    </div>

</body>
</html>
