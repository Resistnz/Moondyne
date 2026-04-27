// Google Calendar Configuration
// Instructions: Fill in these values to fetch live shows from your public Google Calendar.
// To get your Calendar ID: Go to Google Calendar > Settings > Integrate Calendar > Calendar ID
const GOOGLE_API_KEY = "YOUR_API_KEY_HERE";
const CALENDAR_ID = "YOUR_CALENDAR_ID_HERE";

// Fallback data if API key is not set
const fallbackShows = [
  { date: "May 1", venue: "Milk Bar", location: "Inglewood", link: "https://milkbar.oztix.com.au/outlet/event/54315fb9-d74a-439d-9370-301aed875ee3?Event=237644" },
  { date: "May 13", venue: "The Bird", location: "Northbridge", link: "#" },
  { date: "June 13", venue: "Indian Ocean Hotel", location: "Scarborough", link: "" }
];

async function fetchUpcomingShows() {
  if (GOOGLE_API_KEY === "YOUR_API_KEY_HERE" || CALENDAR_ID === "YOUR_CALENDAR_ID_HERE") {
    console.warn("Google API Key or Calendar ID is not set. Using fallback data.");
    return fallbackShows;
  }

  const timeMin = new Date().toISOString();
  // Fetch from Google Calendar API
  const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events?key=${GOOGLE_API_KEY}&timeMin=${timeMin}&singleEvents=true&orderBy=startTime&maxResults=10`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch calendar events");
    const data = await response.json();

    return data.items.map(event => {
      // Format Date
      const eventDate = new Date(event.start.dateTime || event.start.date);
      const dateStr = eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      // Parse Description for Links (looks for anything that starts with http or https)
      let ticketLink = "";
      const desc = event.description || "";

      // We will create a dummy element to strip HTML from Google's description easily
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = desc;
      const strippedDesc = tempDiv.textContent || tempDiv.innerText || "";

      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const match = strippedDesc.match(urlRegex);
      if (match && match.length > 0) {
        ticketLink = match[0]; // Take the first URL found
      }

      return {
        date: dateStr,
        venue: event.summary || "TBA",
        location: event.location || "Location TBA",
        link: ticketLink
      };
    });
  } catch (error) {
    console.error("Error fetching shows:", error);
    return fallbackShows;
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  // Update copyright year
  document.getElementById("year").textContent = new Date().getFullYear();

  // Populate shows
  const showsContainer = document.getElementById("shows-container");
  if (showsContainer) {
    showsContainer.innerHTML = "<p style='text-align: center; color: var(--text-secondary); grid-column: 1/-1;'>Loading shows...</p>";
    const showsData = await fetchUpcomingShows();
    showsContainer.innerHTML = ""; // Clear loading stat 

    if (showsData.length === 0) {
      showsContainer.innerHTML = "<p style='text-align: center; color: var(--text-secondary); grid-column: 1/-1;'>No upcoming shows scheduled. Check back soon!</p>";
    } else {
      showsData.forEach(show => {
        const showDiv = document.createElement("div");
        showDiv.className = "show-item";

        // Render Ticket Button or "Free Entry" Text
        let ticketHTML = show.link
          ? `<a href="${show.link}" target="_blank" rel="noopener noreferrer" class="show-tickets">Tickets</a>`
          : `<span class="show-tickets disabled" style="border-color:transparent; color: var(--text-secondary);">Free / No Tickets</span>`;

        showDiv.innerHTML = `
          <div class="show-date">${show.date}</div>
          <div class="show-venue">${show.venue}</div>
          <div class="show-location">${show.location}</div>
          ${ticketHTML}
        `;
        showsContainer.appendChild(showDiv);
      });
    }
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

  // Lightbox functionality
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const closeBtn = document.querySelector(".lightbox-close");
  const portfolioImages = document.querySelectorAll(".portfolio-img");

  if (lightbox && lightboxImg) {
    portfolioImages.forEach(img => {
      img.addEventListener("click", () => {
        lightbox.style.display = "flex";
        // slight delay to allow display flex to apply before opacity transitions
        setTimeout(() => lightbox.classList.add("active"), 10);
        lightboxImg.src = img.src;
      });
    });

    const closeLightbox = () => {
      lightbox.classList.remove("active");
      setTimeout(() => lightbox.style.display = "none", 200); // Wait for transition
    };

    closeBtn.addEventListener("click", closeLightbox);

    // Close on background click
    lightbox.addEventListener("click", (e) => {
      if (e.target !== lightboxImg) {
        closeLightbox();
      }
    });

    // Close on escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && lightbox.classList.contains("active")) {
        closeLightbox();
      }
    });
  }

  // Gallery Expand functionality
  const galleryWrapper = document.getElementById("gallery-wrapper");
  const seeMoreBtn = document.getElementById("see-more-btn");
  const seeLessBtn = document.getElementById("see-less-btn");

  if (galleryWrapper && seeMoreBtn && seeLessBtn) {
    seeMoreBtn.addEventListener("click", () => {
      galleryWrapper.classList.add("expanded");
    });
    
    seeLessBtn.addEventListener("click", () => {
      galleryWrapper.classList.remove("expanded");
      document.getElementById("media").scrollIntoView({ behavior: 'smooth' });
    });
  }
});
