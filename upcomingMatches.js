document.addEventListener("DOMContentLoaded", () => { // checks that html page has loaded
  const form = document.getElementById("matchForm");
  form.addEventListener("submit", function(event) {
  event.preventDefault();
    addMatch();
  });

  loadMatches(); //load matches from localStorage
  upcomingMatchesCountdown(); // function starts countdowns for existing dates
});

// Save matches to localStorage
function saveMatch(teamA, teamB, matchTime){
  let matches = JSON.parse(localStorage.getItem("matches")) || [];
  matches.push({teamA, teamB, matchTime});
  matches.sort((a, b) => new Date(a.matchTime) - new Date(b.matchTime));
  localStorage.setItem("matches", JSON.stringify(matches));
}

// Loads saved matches from localStorage
function loadMatches(){
  let matches = JSON.parse(localStorage.getItem("matches")) || [];
  matches.sort((a, b) => new Date(a.matchTime) - new Date(b.matchTime));
  const tableBody = document.getElementById("matchTable").getElementsByTagName("tbody")[0];

  for (let match of matches) {
    const newRow = document.createElement("tr");
    newRow.className = "upcoming";
    newRow.classList.add("user-added");

    const teamsCell = newRow.insertCell(0);
    const timeCell = newRow.insertCell(1);
    const countdownCell = newRow.insertCell(2);
    const statusCell = newRow.insertCell(3);

    teamsCell.textContent = `${match.teamA} vs ${match.teamB}`;

    const dates = new Date(match.matchTime);
    timeCell.textContent = dates.toLocaleString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric'
    });

    timeCell.dataset.time = dates.getTime();
    statusCell.textContent = "Upcoming";
    const countdownId = "countdown_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
    countdownCell.id = countdownId;

    const now = Date.now();
    const matchStart = dates.getTime();
    const matchEnd = matchStart + 90 * 60 * 1000; // 90 minutes after start

    // place user-added matches in order
    if (now >= matchEnd) {
      markAsCompleted(newRow, statusCell, countdownCell);  //  Match finished
    } else if (now >= matchStart && now < matchEnd) {
      newRow.classList.remove("upcoming");   // Match currently ongoing
      newRow.classList.add("ongoing");
      statusCell.textContent = "Ongoing";
      countdownCell.textContent = "Ongoing";
      startCountdown(dates, countdownId, newRow, statusCell);
    } else {
      startCountdown(dates, countdownId, newRow, statusCell); // Match upcoming
    }
    
    // Insert matches above completed matches
    const rows = Array.from(tableBody.rows);
    let inserted = false;
    for (let r of rows) {
      if (r.classList.contains("completed")) {
        tableBody.insertBefore(newRow, r);
        inserted = true;
        break;
      }
    }
    if (!inserted) {
      tableBody.appendChild(newRow);
    }
  }
}

function addMatch() { // creates new rows with new match dates
  //input values
  const teamA = document.getElementById("teamA").value;
  const teamB = document.getElementById("teamB").value;
  const matchTime = document.getElementById("matchTime").value; 

  saveMatch(teamA, teamB, matchTime) //save to localStorage

  const tableBody = document.getElementById("matchTable").getElementsByTagName("tbody")[0]; // refers to the table body

  const newRow = document.createElement("tr");  // new row is created for upcoming match
  newRow.className = "upcoming";
  newRow.classList.add("user-added");

  // new row content
  const teamsCell = newRow.insertCell(0);
  const timeCell = newRow.insertCell(1);
  const countdownCell = newRow.insertCell(2);
  const statusCell = newRow.insertCell(3);

  teamsCell.textContent = `${teamA} vs ${teamB}`; // new row format for team names and dates

  // new row format for match dates
  const dates = new Date(matchTime); // takes date input from form
  timeCell.textContent = dates.toLocaleString('en-US', { // creates date format using "dates" input
    month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric'
  });
  timeCell.dataset.time = dates.getTime();
  statusCell.textContent = "Upcoming"; // content inside status cell

  // ID for each countdown cell so that multiple countdowns can run at the same time
  const countdownId = "countdown_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
  countdownCell.id = countdownId;

  // if match time already passed, mark completed instantly
  if (dates.getTime() < new Date().getTime()) {
    markAsCompleted(newRow, statusCell, countdownCell);
  } else {
    // or starts a countdown if date is upcoming
    startCountdown(dates, countdownId, newRow, statusCell);
  }

  const rows = Array.from(tableBody.rows); // makes sure new upcoming matches are added above "completed" matches
  let inserted = false;
  for (let r of rows) {
    if (r.classList.contains("completed")) {
      tableBody.insertBefore(newRow, r);
      inserted = true;
      break;
    }
  }

  // clears inputs after new match is added
  document.getElementById("teamA").value = "";
  document.getElementById("teamB").value = "";
  document.getElementById("matchTime").value = "";
}

function startCountdown(targetDate, countdownId, row, statusCell) { // function that starts/ends countdowns
  const countDownTime = targetDate.getTime();
  const matchDuration = 90 * 60 * 1000; // match lasts 90 minutes

  const interval = setInterval(() => {
    const now = new Date().getTime();
    const timeLeft = countDownTime - now; // keep original variable name

    if (timeLeft > 0) { 
      // calculating time remaining
      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

      document.getElementById(countdownId).innerHTML =
        `${days}d ${hours}h ${minutes}m ${seconds}s`;
    } else if (now - countDownTime < matchDuration) {
      // when countdown reaches 0, row changes from "Upcoming" to "Match Started"/"Ongoing"
      row.classList.remove("upcoming");
      row.classList.add("ongoing");
      statusCell.textContent = "Ongoing";

      const ongoingLeft = Math.max(matchDuration - (now - countDownTime), 0);
      const minutes = Math.floor((ongoingLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((ongoingLeft % (1000 * 60)) / 1000);

      document.getElementById(countdownId).innerHTML = `${minutes}m ${seconds}s`;
    } else {
      // match completed
      clearInterval(interval);
      row.classList.remove("ongoing", "upcoming");
      row.classList.add("completed");
      statusCell.textContent = "Completed";
      document.getElementById(countdownId).innerHTML = "Completed";

      // moves finished matches to the bottom of the table and labels them as "Completed"
      const tableBody = document.getElementById("matchTable").getElementsByTagName("tbody")[0];
      tableBody.appendChild(row);
    }
  }, 1000);
}

// checks for past dates and marks them as "Completed"
function markAsCompleted(row, statusCell, countdownCell) {
  row.classList.remove("upcoming", "ongoing");
  row.classList.add("completed");
  statusCell.textContent = "Completed";
  countdownCell.innerHTML = "Completed";
  const tableBody = document.getElementById("matchTable").getElementsByTagName("tbody")[0];
  tableBody.appendChild(row);
}

// modifies "kickoff" time string so that it can be processed properly
function kickoffString(str) {
  str = str.replace(/[–—-]/g, ' ').trim();
  str = str.replace(/\s+/g, ' ');
  const parsedDate = new Date(str);
  return parsedDate;
}

function upcomingMatchesCountdown() { // identifies which rows are "upcoming"
  const tableBody = document.getElementById("matchTable").getElementsByTagName("tbody")[0];
  const rows = tableBody.getElementsByTagName("tr");

  for (let row of rows) { // loops inside table rows
    if (row.classList.contains("upcoming")) { // only "upcoming" matches
      const timeCell = row.cells[1];
      const countdownCell = row.cells[2];
      const statusCell = row.cells[3];

      const dates = new Date(timeCell.textContent);

      // creates ID for each cell to know where to display time
      const countdownId = "countdown_" + Math.floor(Math.random() * 100000);
      countdownCell.id = countdownId;

      // converts "kickoff" to readable date
      if (timeCell.dataset.time) {
        dates = new Date(parseInt(timeCell.dataset.time));
      } else {
        dates = kickoffString(timeCell.textContent);
      }

      // check if past or upcoming dates
      if (Date.now() - dates.getTime() < 90 * 60 * 1000 && Date.now() >= dates.getTime()) {
      // match started but still ongoing
        startCountdown(dates, countdownId, row, statusCell);
      } else if (dates.getTime() < Date.now()) {
     // for past dates, mark as completed
        markAsCompleted(row, statusCell, countdownCell);
      } else {
     // for future dates, start countdown
        startCountdown(dates, countdownId, row, statusCell);
      }
    }
  }
}

// Clear matches from localStorage
function clearAllMatches(){
  localStorage.removeItem("matches");
  const tableBody = document.getElementById("matchTable").getElementsByTagName("tbody")[0];
  // deletes matches added by user
  const userRows = tableBody.querySelectorAll(".user-added");
  userRows.forEach(row => row.remove());
}
