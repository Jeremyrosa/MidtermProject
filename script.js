
    // checks that html page has loaded
    document.addEventListener("DOMContentLoaded", () => {
      const form = document.getElementById("matchForm");
      form.addEventListener("submit", function(event) {
        event.preventDefault();
        AddMatch();
      });

      // function starts countdowns for existing dates
      upcomingMatchesCountdown();
    });

    function AddMatch() { // creates new rows with new match dates
      //input values
      const teamA = document.getElementById("teamA").value;
      const teamB = document.getElementById("teamB").value;
      const matchTime = document.getElementById("matchTime").value; 

      // refers to the table body
      const tableBody = document.getElementById("matchTable").getElementsByTagName("tbody")[0];

      // new row is created for upcoming match
      const newRow = document.createElement("tr");
      newRow.className = "upcoming";

      // new row content
      const teamsCell = newRow.insertCell(0);
      const timeCell = newRow.insertCell(1);
      const countdownCell = newRow.insertCell(2);
      const statusCell = newRow.insertCell(3);

      // new row format for team names and dates
      teamsCell.textContent = `${teamA} vs ${teamB}`;

      // new row format for match dates
      const dates = new Date(matchTime); // takes date input from form
      timeCell.textContent = dates.toLocaleString('en-US', { // creates date format using "dates" input
          month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric'
        });
      statusCell.textContent = "Upcoming"; // content inside status cell

      // ID for each countdown cell so that multiple countdowns can run at the same time
      const countdownId = "countdown_" + Date.now();
      countdownCell.id = countdownId;

      // function that starts countdowns with its attributes
      startCountdown(dates, countdownId, newRow, statusCell);

      // makes sure new upcoming matches are added above "completed" matches
      const rows = Array.from(tableBody.rows);
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

    // function that starts/ends countdowns
    function startCountdown(targetDate, countdownId, row, statusCell) {
      const countDownTime = targetDate.getTime();

      const interval = setInterval(() => {
        // calculating time remaining
        const now = new Date().getTime();
        const timeLeft = countDownTime - now;

        // when countdown reaches 0, row changes to from "Upcoming" to "Match Started" and "Ongoing"
        if (timeLeft <= 0) {
          clearInterval(interval);
          document.getElementById(countdownId).innerHTML = "Match Started";
          row.classList.remove("upcoming");
          row.classList.add("ongoing");
          statusCell.textContent = "Ongoing";

          return;
        }

        // time calculated in days, hours, mins, secs
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        // countdown display format
        document.getElementById(countdownId).innerHTML =
          `${days}d ${hours}h ${minutes}m ${seconds}s`;
      }, 1000);
    }

    // modifies "kickoff" time string so that it can be processed properly
    function kickoffString(str) {
      str = str.replace(/–/g, ':').trim();
      str = str.replace(/[:]/, ' ');
      return new Date(str);
    }

    // identifies which rows are "upcoming"
    function upcomingMatchesCountdown() {
      const tableBody = document.getElementById("matchTable").getElementsByTagName("tbody")[0];
      const rows = tableBody.getElementsByTagName("tr");

      for (let row of rows) { // loops inside table rows
        if (row.classList.contains("upcoming")) { // only "upcoming" matches
          const timeCell = row.cells[1];
          const countdownCell = row.cells[2];
          const statusCell = row.cells[3];

          // creates ID for each cell to know where to display time
          const countdownId = "countdown_" + Math.floor(Math.random() * 100000);
          countdownCell.id = countdownId;

          const dates = kickoffString(timeCell.textContent); // converts "kickoff" to a readable string
          startCountdown(dates, countdownId, row, statusCell); // starts countdown
        }
      }
    }
