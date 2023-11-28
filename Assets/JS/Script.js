// Close user session
document.getElementById("logout-button").addEventListener("click", function () {
    document.getElementById("loading").style.display = "block";
    sessionStorage.removeItem("user");
    document.getElementById("loading").style.display = "none";
    window.location.href = "../index.html";
});