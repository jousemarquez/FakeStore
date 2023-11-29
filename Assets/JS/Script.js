// Check if user is logged. In case of Visitor, redirect to login path.
const isLogged = sessionStorage.getItem('loggedInUser') !== null;
if (!isLogged && window.location.pathname !== "/Login/index.html") {
    window.location.href = "../Login/index.html";
}

document.addEventListener('DOMContentLoaded', function () {
    const loggedInUser = sessionStorage.getItem('loggedInUser');
    const loggedInUserDisplay = document.getElementById('loggedInUserDisplay');
    const loginLogoutButton = document.getElementById('login-logout-button');

    if (loggedInUser) {
        loggedInUserDisplay.textContent = `Welcome, ${loggedInUser}!`;
        loginLogoutButton.textContent = "Logout";
    } else {
        loggedInUserDisplay.style.display = "none";
    }

    // Evento click para el botón "Login/Logout"
    loginLogoutButton.addEventListener("click", function () {
        const loadingIndicator = document.getElementById("loading");

        if (loggedInUser) {
            // Usuario ha iniciado sesión, realiza el logout
            loadingIndicator.style.display = "block";
            sessionStorage.clear();
            loadingIndicator.style.display = "none";
            window.location.replace("../index.html");
        } else {
            // Usuario no ha iniciado sesión, redirige a la página de inicio de sesión
            window.location.replace("./Login/index.html");
        }
    });
})

// Menú Hamburger
document.addEventListener("DOMContentLoaded", function () {
    const hamburgerMenu = document.querySelector(".hamburger-menu");
    const menu = document.querySelector(".menu");

    hamburgerMenu.addEventListener("click", function () {
        menu.classList.toggle("show");
    });
});;
