
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

const carouselData = [
  {
    title: "Budget Tracker Setup",
    image: "assets/images/sample-budget.png",
    desc: "A custom-built monthly tracker that auto-categorizes spending and keeps your goals in focus."
  },
  {
    title: "Shared Family Calendar",
    image: "assets/images/sample-calendar.png",
    desc: "One calendar, multiple users, all synced and organized for everyday life and future plans."
  },
  {
    title: "Domain & Email HQ",
    image: "assets/images/sample-domain.png",
    desc: "Professional-grade personal domain and email workspace — no IT team required."
  },
  {
    title: "Wedding Guests to Rolodex",
    image: "assets/images/wedding.png",
    desc: "Capture your contacts in one place and use to manage invites, seating charts, and future holiday cards, with a vendor upselling you."
  }
];

let currentSlide = 0;

function updateCarousel() {
  const { title, image, desc } = carouselData[currentSlide];
  document.getElementById("carouselTitle").innerText = title;
  document.getElementById("carouselImage").src = image;
  document.getElementById("carouselDesc").innerText = desc;
}

function openCarousel() {
  currentSlide = 0;
  updateCarousel();
  document.getElementById("carouselOverlay").style.display = "flex";
}

function closeCarousel(e) {
  if (!e || e.target.id === "carouselOverlay") {
    document.getElementById("carouselOverlay").style.display = "none";
  }
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % carouselData.length;
  updateCarousel();
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + carouselData.length) % carouselData.length;
  updateCarousel();
}

/* === Google Analytics: Debug & Scroll Tracking === */
if (window.location.search.includes('debug=drew')) {
  gtag('set', 'user_properties', { user_type: 'drew_test' });
}
gtag('event', 'scroll_depth', {
  event_category: 'engagement',
  event_label: '50_percent_scroll'
});