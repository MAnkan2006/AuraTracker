document.addEventListener("DOMContentLoaded", () => {
  // Load and apply color scheme preference
  const savedScheme = localStorage.getItem("auratracker_scheme") || "dark";
  document.documentElement.setAttribute("data-scheme", savedScheme);

  // Color Scheme Switch Listener
  const btnToggleScheme = document.getElementById("btn-toggle-scheme");
  if (btnToggleScheme) {
    btnToggleScheme.addEventListener("click", () => {
      const currentScheme = document.documentElement.getAttribute("data-scheme") || "dark";
      const newScheme = currentScheme === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-scheme", newScheme);
      localStorage.setItem("auratracker_scheme", newScheme);
    });
  }

  // Initialize Lucide Icons
  if (window.lucide && typeof window.lucide.createIcons === "function") {
    window.lucide.createIcons();
  }

  // Mobile Menu Toggle
  const mobileToggle = document.getElementById("mobile-toggle");
  const navLinks = document.getElementById("nav-links");

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener("click", () => {
      navLinks.classList.toggle("open");
      
      // Update toggle icon
      const icon = mobileToggle.querySelector("i");
      if (icon) {
        const isOpen = navLinks.classList.contains("open");
        icon.setAttribute("data-lucide", isOpen ? "x" : "menu");
        if (window.lucide && typeof window.lucide.createIcons === "function") {
          window.lucide.createIcons();
        }
      }
    });
  }

  // Interactive Theme Selector Demo
  const themeBtns = document.querySelectorAll(".theme-btn");
  const previewCard = document.querySelector(".demo-preview-card");
  
  if (themeBtns && previewCard) {
    themeBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        // Remove active class from buttons
        themeBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        // Set theme dataset on document element to trigger css updates
        const selectedTheme = btn.getAttribute("data-theme");
        document.documentElement.setAttribute("data-theme", selectedTheme);

        // Dynamically adjust preview card box-shadow / border match accent
        let accentGlowColor = "rgba(99, 102, 241, 0.4)";
        let accentColor = "#6366f1";
        
        switch (selectedTheme) {
          case "cyberpunk-onyx":
            accentColor = "#ff007f";
            accentGlowColor = "rgba(255, 0, 127, 0.5)";
            break;
          case "emerald-deep":
            accentColor = "#10b981";
            accentGlowColor = "rgba(16, 185, 129, 0.4)";
            break;
          case "nebula-cosmic":
            accentColor = "#8b5cf6";
            accentGlowColor = "rgba(139, 92, 246, 0.45)";
            break;
          case "sunset-crimson":
            accentColor = "#f43f5e";
            accentGlowColor = "rgba(244, 63, 94, 0.45)";
            break;
          case "nordic-frost":
            accentColor = "#0ea5e9";
            accentGlowColor = "rgba(14, 165, 233, 0.4)";
            break;
          case "amber-gold":
            accentColor = "#f59e0b";
            accentGlowColor = "rgba(245, 158, 11, 0.45)";
            break;
          default:
            accentColor = "#6366f1";
            accentGlowColor = "rgba(99, 102, 241, 0.4)";
        }
        
        previewCard.style.borderColor = accentColor;
        previewCard.style.boxShadow = `0 0 24px ${accentGlowColor}`;
      });
    });
  }

  // Interactive Font Selector Demo
  const fontBtns = document.querySelectorAll(".font-btn");
  if (fontBtns) {
    fontBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        fontBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        const selectedFont = btn.getAttribute("data-font");
        document.documentElement.setAttribute("data-font", selectedFont);
      });
    });
  }

  // Capabilities Tour Navigation
  const tourTabs = document.querySelectorAll(".tour-tab");
  const tourPanes = document.querySelectorAll(".tour-pane");
  
  if (tourTabs.length > 0 && tourPanes.length > 0) {
    tourTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        // Toggle active button
        tourTabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        
        // Toggle active view pane
        tourPanes.forEach((p) => p.classList.remove("active"));
        const targetId = tab.getAttribute("data-tour-tab");
        const targetPane = document.getElementById(targetId);
        if (targetPane) {
          targetPane.classList.add("active");
        }
      });
    });
  }
});
