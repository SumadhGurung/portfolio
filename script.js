/* =====================================================
   PORTFOLIO — script.js
   Mobile nav · scroll reveal · active link · contact form
   ===================================================== */

(function () {
  "use strict";

  /* ---------------------------------------------
     Footer year stamp
  --------------------------------------------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------------------------------------
     Mobile nav toggle
  --------------------------------------------- */
  const toggle = document.getElementById("navToggle");
  const links  = document.getElementById("navLinks");

  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const isOpen = links.classList.toggle("is-open");
      toggle.classList.toggle("is-open", isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    // Close menu when a nav link is clicked
    links.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        links.classList.remove("is-open");
        toggle.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });

    // Close on Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && links.classList.contains("is-open")) {
        links.classList.remove("is-open");
        toggle.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------------------------------------------
     Sticky nav shadow on scroll
  --------------------------------------------- */
  const nav = document.getElementById("nav");
  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle("is-scrolled", window.scrollY > 8);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------------------------------------------
     Smooth scroll for in-page anchor links
  --------------------------------------------- */
  const NAV_OFFSET = 72; // matches --nav-h
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });

  /* ---------------------------------------------
     Active nav link based on scroll position
  --------------------------------------------- */
  const sectionIds = ["home", "about", "projects", "contact"];
  const sections   = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);
  const navAnchors = document.querySelectorAll(".nav__links a");

  if (sections.length && "IntersectionObserver" in window) {
    const navIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            navAnchors.forEach((a) => {
              a.classList.toggle("is-active", a.getAttribute("href") === "#" + id);
            });
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => navIO.observe(s));
  }

  /* ---------------------------------------------
     Scroll reveal
  --------------------------------------------- */
  const revealEls = document.querySelectorAll(
    ".hero > *, .section__title, .about > *, .project-card, .contact__lede, .contact-form"
  );
  revealEls.forEach((el) => el.classList.add("reveal"));

  if ("IntersectionObserver" in window) {
    const revealIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealIO.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => revealIO.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------------------------------------------
     Contact form handler
     - prevents default reload
     - validates non-empty fields
     - shows success / error message
     - clears inputs on success
  --------------------------------------------- */
  const form   = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");

  if (form && status) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      // Pull and trim values
      const name    = form.name.value.trim();
      const email   = form.email.value.trim();
      const message = form.message.value.trim();

      // Simple email pattern check
      const emailLooksValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      // Validation
      if (!name || !email || !message) {
        status.textContent = "Please fill in all fields before sending.";
        status.classList.remove("is-success");
        status.classList.add("is-error");
        return;
      }

      if (!emailLooksValid) {
        status.textContent = "Please enter a valid email address.";
        status.classList.remove("is-success");
        status.classList.add("is-error");
        return;
      }

      // Simulate submission (no backend in this demo)
      // Replace this block with a real fetch() call to your endpoint.
      try {
        // For demo purposes we just resolve on the next tick.
        // In production you might do:
        //   await fetch("/api/contact", { method: "POST", body: new FormData(form) });
        status.textContent = "Message Sent Successfully!";
        status.classList.remove("is-error");
        status.classList.add("is-success");
        form.reset();

        // Auto-hide success message after 6s
        setTimeout(() => {
          if (status.textContent === "Message Sent Successfully!") {
            status.textContent = "";
            status.classList.remove("is-success");
          }
        }, 6000);
      } catch (err) {
        status.textContent = "Something went wrong. Please try again.";
        status.classList.remove("is-success");
        status.classList.add("is-error");
      }
    });
  }
})();
