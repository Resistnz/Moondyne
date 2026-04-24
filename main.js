const showsData = [
  { date: "Oct 24", venue: "The Velvet Lounge", location: "Seattle, WA", link: "#" },
  { date: "Oct 28", venue: "Electric Avenue", location: "Portland, OR", link: "#" },
  { date: "Nov 02", venue: "The Fillmore (Opener)", location: "San Francisco, CA", link: "#" },
  { date: "Nov 15", venue: "Desert Skies Festival", location: "Joshua Tree, CA", link: "#" },
  { date: "Dec 05", venue: "Starlight Ballroom", location: "Los Angeles, CA", link: "#" }
];

document.addEventListener("DOMContentLoaded", () => {
  // Update copyright year
  document.getElementById("year").textContent = new Date().getFullYear();

  // Populate shows
  const showsContainer = document.getElementById("shows-container");
  if (showsContainer) {
    showsData.forEach(show => {
      const showDiv = document.createElement("div");
      showDiv.className = "show-item";
      showDiv.innerHTML = `
        <div class="show-date">${show.date}</div>
        <div class="show-venue">${show.venue}</div>
        <div class="show-location">${show.location}</div>
        <a href="${show.link}" class="show-tickets">Tickets</a>
      `;
      showsContainer.appendChild(showDiv);
    });
  }

  // Header Scroll Effect
  const header = document.getElementById("site-header");
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };
  window.addEventListener("scroll", handleScroll);
  handleScroll(); // Init

  // Intersection Observer for scroll fade-in effects
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const sections = document.querySelectorAll('.fade-in-section');
  sections.forEach(section => {
    observer.observe(section);
  });
});
