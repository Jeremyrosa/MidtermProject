document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let username = document.getElementById("username").value.trim();
    let password = document.getElementById("password").value.trim();

    fetch("login.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username, password: password })
    })

    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = "upcomingGames.html";
        } else {
            alert(data.message || "Invalid username or password.");
        }
    })

    .catch(error => console.error("Error:", error));
});