// 404 Error
document.addEventListener("DOMContentLoaded", function () {
    var currentPage = window.location.pathname;
    if (currentPage === "/path-do-not-exist") {
        window.location.href = "/404.html";
    }
});