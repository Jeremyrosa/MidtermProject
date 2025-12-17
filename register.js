document.getElementById("regForm").addEventListener("submit", function(e) {
    e.preventDefault();

    let email = document.getElementById("email").value.trim();
    let username = document.getElementById("username").value.trim();
    let password = document.getElementById("password").value.trim();

    fetch("register.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: email,
            username: username,
            password: password
        })
    })

    .then(response => response.json())
    .then(data => {
        if (data.success) {
            localStorage.setItem("loggedIn", "true");
            window.location.href = "teamPage.html";
        } else {
            alert(data.message || "Registration failed.");
        }
    })
    
    .catch(error => console.error("Error:", error));
});

// Splash screen
window.addEventListener("load", () => {
  const splash = document.getElementById("splash");

  setTimeout(() => {
    splash.classList.add("fade-out");

    setTimeout(() => {
      splash.style.display = "none";
    }, 800);
  }, 2000); // splash visible for 2 seconds
});

