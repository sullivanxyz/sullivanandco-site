
function toggleMenu() {
    var menu = document.getElementById("dropdown-menu");
    menu.style.display = menu.style.display === "block" ? "none" : "block";
}

document.addEventListener("click", function(event) {
    var menu = document.getElementById("dropdown-menu");
    var icon = document.querySelector(".menu-icon");
    if (!menu.contains(event.target) && !icon.contains(event.target)) {
        menu.style.display = "none";
    }
});

function openCarousel() {
    document.getElementById('carouselOverlay').style.display = 'flex';
}

function closeCarousel() {
    document.getElementById('carouselOverlay').style.display = 'none';
}
