
function toggleMenu() {
    var menu = document.getElementById("dropdown-menu");
    var open = menu.style.display !== "block";
    menu.style.display = open ? "block" : "none";
    var icon = document.querySelector(".menu-icon");
    if (icon) icon.setAttribute("aria-expanded", open ? "true" : "false");
}

document.addEventListener("click", function(event) {
    var menu = document.getElementById("dropdown-menu");
    var icon = document.querySelector(".menu-icon");
    var clickedLink = menu.contains(event.target) && event.target.closest("a");
    if (clickedLink || (!menu.contains(event.target) && !icon.contains(event.target))) {
        menu.style.display = "none";
        if (icon) icon.setAttribute("aria-expanded", "false");
    }
});

/* Carousel code removed — replaced by the interactive showcase
   (assets/scripts/showcase.js). */

/* === Google Analytics: Debug & Scroll Tracking === */
if (window.location.search.includes('debug=drew')) {
  gtag('set', 'user_properties', { user_type: 'drew_test' });
}

/* Fire the 50% scroll-depth event once, when the reader actually gets there
   (previously fired unconditionally on page load, inflating the metric). */
var scrollDepthFired = false;
window.addEventListener('scroll', function () {
  if (scrollDepthFired) return;
  var pct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
  if (pct >= 0.5) {
    scrollDepthFired = true;
    gtag('event', 'scroll_depth', {
      event_category: 'engagement',
      event_label: '50_percent_scroll'
    });
  }
});