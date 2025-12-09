// ==============================
// GLOBAL HELPERS (used by HTML)
// ==============================

(function () {
  "use strict";

  // Smooth scroll to section with navbar offset
  function scrollToSection(sectionId) {
    const target = document.getElementById(sectionId);
    if (!target) return;

    const rect = target.getBoundingClientRect();
    const scrollTop =
      window.pageYOffset || document.documentElement.scrollTop || 0;
    const navbar = document.querySelector(".navbar");
    const navbarHeight = navbar ? navbar.offsetHeight : 0;

    const offset = rect.top + scrollTop - (navbarHeight + 12);

    window.scrollTo({
      top: offset < 0 ? 0 : offset,
      behavior: "smooth",
    });
  }

  // Basic UX feedback on form submit (does NOT block Django submit)
  function formSubmit(event) {
    const form = event.target;
    const messageEl = document.getElementById("form-message");

    // Let browser handle validation UI first
    if (!form.checkValidity()) {
      return;
    }

    if (messageEl) {
      messageEl.textContent = "Sending your message...";
      messageEl.className = "form-message";
    }
    // Do NOT preventDefault so Django view receives normal POST
  }

  // Expose for inline handlers in HTML
  window.scrollToSection = scrollToSection;
  window.formSubmit = formSubmit;

  // ==============================
  // MAIN INIT
  // ==============================

  document.addEventListener("DOMContentLoaded", function () {
    const body = document.body;
    const navbar = document.querySelector(".navbar");
    const navToggle = document.querySelector(".nav-toggle");
    const navLinksContainer = document.querySelector(".nav-links");
    const navButtons = navLinksContainer
      ? Array.from(navLinksContainer.querySelectorAll("button"))
      : [];
    const themeToggle = document.querySelector(".theme-toggle");
    const backToTopBtn = document.querySelector(".back-to-top");
    const typedTextEl = document.getElementById("typed-text");
    const scrollProgressBar = document.querySelector(".scroll-progress-bar");
    const copyEmailBtn = document.querySelector(".copy-email-button");
    const projectFilterButtons = document.querySelectorAll(".filter-button");
    const projectCards = document.querySelectorAll(".proj-card");

    // ------------------------------
    // THEME (dark/light) INITIALIZE
    // ------------------------------
    initTheme();
    setupThemeToggle();

    // ------------------------------
    // NAVIGATION (desktop + mobile)
    // ------------------------------
    setupNavButtons();
    setupNavToggle();
    setupScrollHandlers();
    setupSectionObserver();

    // ------------------------------
    // SCROLL ANIMATIONS + SKILLS
    // ------------------------------
    initScrollAnimations();

    // ------------------------------
    // BACK TO TOP BUTTON
    // ------------------------------
    setupBackToTop();

    // ------------------------------
    // TYPED TEXT EFFECT
    // ------------------------------
    initTypewriter();

    // COPY EMAIL BUTTON
    // ------------------------------
    setupCopyEmail();

    // ANIMATED STATS COUNTERS
    // ------------------------------
    initCounters();

    // PROJECT FILTERS
    // ------------------------------
    setupProjectFilters();

    // PROJECT FLIP CARDS (click to flip, esp. on mobile)
    // ------------------------------
    setupProjectFlips();

    // ==========================
    // FUNCTIONS
    // ==========================

    // THEME --------------------

    function initTheme() {
      const stored = localStorage.getItem("theme");

      // If user has chosen a theme before, respect that
      if (stored === "dark" || stored === "light") {
        body.dataset.theme = stored;
        return;
      }

      // Otherwise, default to dark
      const defaultTheme = "dark";
      body.dataset.theme = defaultTheme;
      localStorage.setItem("theme", defaultTheme);
    }

    function toggleTheme() {
      const current = body.dataset.theme === "light" ? "light" : "dark";
      const next = current === "dark" ? "light" : "dark";
      body.dataset.theme = next;
      localStorage.setItem("theme", next);
    }

    function setupThemeToggle() {
      if (!themeToggle) return;
      themeToggle.addEventListener("click", toggleTheme);
    }

    // NAV ----------------------

    // Map nav buttons to their target sections using the inline onclick attribute
    function setupNavButtons() {
      navButtons.forEach((btn) => {
        const onClickAttr = btn.getAttribute("onclick");
        if (!onClickAttr) return;
        const match = onClickAttr.match(/scrollToSection\('([^']+)'\)/);
        if (match && match[1]) {
          btn.dataset.targetSection = match[1];
        }
      });

      // Close mobile menu when a nav button is clicked
      navButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
          if (body.classList.contains("nav-open")) {
            closeNav();
          }
        });
      });
    }

    function setupNavToggle() {
      if (!navToggle) return;

      navToggle.addEventListener("click", () => {
        if (body.classList.contains("nav-open")) {
          closeNav();
        } else {
          openNav();
        }
      });
    }

    function openNav() {
      body.classList.add("nav-open");
      if (navToggle) {
        navToggle.setAttribute("aria-expanded", "true");
      }
    }

    function closeNav() {
      body.classList.remove("nav-open");
      if (navToggle) {
        navToggle.setAttribute("aria-expanded", "false");
      }
    }

    function setActiveNavButton(sectionId) {
      if (!sectionId) return;
      navButtons.forEach((btn) => {
        if (btn.dataset.targetSection === sectionId) {
          btn.classList.add("active");
        } else {
          btn.classList.remove("active");
        }
      });
    }

    // SECTION OBSERVER (active nav link)
    function setupSectionObserver() {
      const sections = document.querySelectorAll("section[id]");
      if (!("IntersectionObserver" in window) || sections.length === 0) {
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const id = entry.target.id;
              setActiveNavButton(id);
            }
          });
        },
        {
          threshold: 0.35,
        }
      );

      sections.forEach((section) => observer.observe(section));
    }

    // SCROLL HANDLERS (navbar style + back-to-top visibility)
    function setupScrollHandlers() {
      handleScroll(); // initial
      window.addEventListener("scroll", handleScroll, { passive: true });
    }

    function handleScroll() {
      const scrollY =
        window.pageYOffset || document.documentElement.scrollTop || 0;

      // Scroll progress bar
      if (scrollProgressBar) {
        const docHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? scrollY / docHeight : 0;
        scrollProgressBar.style.width = (progress * 100).toFixed(2) + "%";
      }

      // Navbar background + shadow when scrolled
      if (navbar) {
        if (scrollY > 8) {
          navbar.classList.add("navbar--scrolled");
        } else {
          navbar.classList.remove("navbar--scrolled");
        }
      }

      // Navbar background + shadow when scrolled
      if (navbar) {
        if (scrollY > 8) {
          navbar.classList.add("navbar--scrolled");
        } else {
          navbar.classList.remove("navbar--scrolled");
        }
      }

      // Back to top button visibility
      if (backToTopBtn) {
        if (scrollY > 400) {
          backToTopBtn.classList.add("visible");
        } else {
          backToTopBtn.classList.remove("visible");
        }
      }
    }

    // SCROLL ANIMATIONS -------

    function initScrollAnimations() {
      const animateEls = document.querySelectorAll(".animate-on-scroll");

      if (!("IntersectionObserver" in window) || animateEls.length === 0) {
        // Fallback: show everything
        animateEls.forEach((el) => el.classList.add("is-visible"));
        return;
      }

      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const el = entry.target;
              el.classList.add("is-visible");

              // If this is a skill meter, animate radial progress
              if (el.classList.contains("skill-meter")) {
                animateSkillMeter(el);
              }

              obs.unobserve(el);
            }
          });
        },
        {
          threshold: 0.18,
        }
      );

      animateEls.forEach((el) => observer.observe(el));
    }

    // Radial skill meter animation
    function animateSkillMeter(meterEl) {
      if (meterEl.dataset.animated === "true") return;
      meterEl.dataset.animated = "true";

      const radial = meterEl.querySelector(".radial-progress");
      const label = meterEl.querySelector(".radial-label");
      if (!radial || !label) return;

      const targetPercent =
        parseInt(meterEl.getAttribute("data-percent"), 10) || 0;
      const targetDeg = (targetPercent / 100) * 360;
      const duration = 1200;
      let start = null;

      // Start from 0
      label.textContent = "0%";
      radial.style.setProperty("--progress", "0deg");

      function step(timestamp) {
        if (!start) start = timestamp;
        const elapsed = timestamp - start;
        const progress = Math.min(elapsed / duration, 1);

        const currentDeg = targetDeg * progress;
        const currentPercent = Math.round(targetPercent * progress);

        radial.style.setProperty("--progress", currentDeg + "deg");
        label.textContent = currentPercent + "%";

        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      }

      window.requestAnimationFrame(step);
    }

    // BACK TO TOP --------------

    function setupBackToTop() {
      if (!backToTopBtn) return;
      backToTopBtn.addEventListener("click", function () {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      });
    }

    // TYPED TEXT ---------------

    function initTypewriter() {
      if (!typedTextEl) return;

      const phrases = [
        "Python & Django Backend Developer",
        "REST API & Automation Specialist",
        "Building Reliable Backend Systems",
      ];

      let phraseIndex = 0;
      let charIndex = 0;
      let isDeleting = false;

      const typeSpeed = 80;
      const deleteSpeed = 45;
      const pauseAfterTyping = 1400;
      const pauseAfterDeleting = 400;

      function type() {
        const currentPhrase = phrases[phraseIndex];

        if (!isDeleting) {
          // Typing forward
          charIndex++;
          typedTextEl.textContent = currentPhrase.slice(0, charIndex);

          if (charIndex === currentPhrase.length) {
            isDeleting = true;
            setTimeout(type, pauseAfterTyping);
          } else {
            setTimeout(type, typeSpeed);
          }
        } else {
          // Deleting
          charIndex--;
          typedTextEl.textContent = currentPhrase.slice(0, charIndex);

          if (charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            setTimeout(type, pauseAfterDeleting);
          } else {
            setTimeout(type, deleteSpeed);
          }
        }
      }

      // Start a little after load
      setTimeout(type, 400);
    }

    // COPY EMAIL ---------------

    function setupCopyEmail() {
      if (!copyEmailBtn) return;

      const email = copyEmailBtn.getAttribute("data-email");
      const feedbackEl = copyEmailBtn.nextElementSibling; // .copy-email-feedback

      copyEmailBtn.addEventListener("click", async () => {
        if (!email) return;

        let success = false;

        // Modern API
        if (navigator.clipboard && navigator.clipboard.writeText) {
          try {
            await navigator.clipboard.writeText(email);
            success = true;
          } catch (e) {
            success = false;
          }
        } else {
          // Fallback for older browsers
          const textarea = document.createElement("textarea");
          textarea.value = email;
          textarea.style.position = "fixed";
          textarea.style.left = "-9999px";
          document.body.appendChild(textarea);
          textarea.select();
          try {
            success = document.execCommand("copy");
          } catch (e) {
            success = false;
          }
          document.body.removeChild(textarea);
        }

        if (feedbackEl) {
          feedbackEl.textContent = success ? "Copied!" : "Failed";
          feedbackEl.classList.remove("success", "error");
          feedbackEl.classList.add(success ? "success" : "error");
        }

        copyEmailBtn.classList.add("copied");

        // Reset after 1.5 seconds
        setTimeout(() => {
          copyEmailBtn.classList.remove("copied");
          if (feedbackEl) {
            feedbackEl.textContent = "";
            feedbackEl.classList.remove("success", "error");
          }
        }, 1500);
      });
    }

    // COUNTERS (ABOUT STATS) -----

    function initCounters() {
      const statsContainer = document.querySelector(".about-stats");
      const counters = document.querySelectorAll(".stat-number[data-target]");

      if (!statsContainer || counters.length === 0) return;

      // If IntersectionObserver is not supported, animate immediately
      if (!("IntersectionObserver" in window)) {
        counters.forEach(animateCounter);
        return;
      }

      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              counters.forEach(animateCounter);
              obs.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.35,
        }
      );

      observer.observe(statsContainer);
    }

    function animateCounter(el) {
      if (el.dataset.animated === "true") return;
      el.dataset.animated = "true";

      const target = parseInt(el.getAttribute("data-target"), 10) || 0;
      const suffix = el.getAttribute("data-suffix") || "";
      const duration = 1200; // ms
      const startTime = performance.now();

      function update(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = Math.floor(target * progress);

        el.textContent = current + suffix;

        if (progress < 1) {
          window.requestAnimationFrame(update);
        }
      }

      window.requestAnimationFrame(update);
    }

    function setupProjectFilters() {
      if (!projectFilterButtons.length || !projectCards.length) return;

      projectFilterButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
          const filter = btn.getAttribute("data-filter") || "all";

          // active state on buttons
          projectFilterButtons.forEach((b) =>
            b.classList.toggle("active", b === btn)
          );

          // show/hide cards
          projectCards.forEach((card) => {
            const category = card.getAttribute("data-category") || "";
            const matches = filter === "all" ? true : category === filter;

            if (matches) {
              card.classList.remove("is-filtered-out");
              card.classList.remove("is-flipped");
            } else {
              card.classList.add("is-filtered-out");
              card.classList.remove("is-flipped");
            }
          });
        });
      });
    }
  });
})();
