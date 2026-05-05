document.addEventListener("DOMContentLoaded", function () {
  /* ══════════════════════════════════════════════════════════════════
     EmailJS — SETUP
     1. Go to https://www.emailjs.com/ → sign up free
     2. Create a Service (Gmail) → note your SERVICE_ID
     3. Create an Email Template with variables:
        {{from_name}}, {{from_email}}, {{phone}}, {{message}}
        → note your TEMPLATE_ID
     4. Copy your Public Key from Account → API Keys
     5. Replace the three placeholders below
  ══════════════════════════════════════════════════════════════════ */
  const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY"; // ← replace
  const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID"; // ← replace
  const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID"; // ← replace

  if (typeof emailjs !== "undefined") {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }

  /* ── Lottie animation ─────────────────────────────────────────────── */
  const lottieContainer = document.getElementById("lottieContainer");
  if (lottieContainer && typeof lottie !== "undefined") {
    lottie.loadAnimation({
      container: lottieContainer,
      renderer: "svg",
      loop: true,
      autoplay: true,
      path: "assets/animations/developer skills.json",
    });
  }

  /* ── Navbar ───────────────────────────────────────────────────────── */
  const hamburger = document.getElementById("hamburger");
  const mobileNav = document.getElementById("mobileNav");
  const scrollTopBtn = document.getElementById("scrollTop");

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("open");
    mobileNav.classList.toggle("open");
  });

  mobileNav.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      hamburger.classList.remove("open");
      mobileNav.classList.remove("open");
    });
  });

  /* ── Smooth scroll WITHOUT hash in URL ───────────────────────────── */
  // Intercept ALL anchor clicks that target a section id
  document.querySelectorAll('a[href^="#"], a[data-section]').forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      const section = this.getAttribute("data-section");

      // Determine target id
      let targetId = null;
      if (section === "hero" || href === "#" || href === "#hero") {
        // Scroll to top — no hash added
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        history.replaceState(null, "", window.location.pathname);
        return;
      } else if (href && href.startsWith("#") && href.length > 1) {
        targetId = href.slice(1);
      } else if (section && section !== "hero") {
        targetId = section;
      }

      if (targetId) {
        const target = document.getElementById(targetId);
        if (target) {
          e.preventDefault();
          const navH =
            parseInt(
              getComputedStyle(document.documentElement).getPropertyValue(
                "--nav-h"
              )
            ) || 68;
          const top =
            target.getBoundingClientRect().top + window.scrollY - navH;
          window.scrollTo({ top, behavior: "smooth" });
          // Push clean URL without hash
          history.pushState(null, "", window.location.pathname);
        }
      }
    });
  });

  /* ── Active nav on scroll ─────────────────────────────────────────── */
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-links a, .mobile-nav a");

  function setActiveNav() {
    const scrollY = window.scrollY + 90;
    let found = false;
    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute("id");
      if (scrollY >= top && scrollY < top + height) {
        found = true;
        navLinks.forEach((a) => {
          a.classList.remove("active");
          const aSection = a.getAttribute("data-section");
          const aHref = a.getAttribute("href");
          if (aSection === id || aHref === "#" + id) {
            a.classList.add("active");
          }
        });
      }
    });
    // If near top, activate Home
    if (window.scrollY < 80) {
      navLinks.forEach((a) => {
        a.classList.remove("active");
        if (
          a.getAttribute("data-section") === "hero" ||
          a.getAttribute("href") === "#"
        ) {
          a.classList.add("active");
        }
      });
    }
  }

  function handleScroll() {
    setActiveNav();
    scrollTopBtn.classList.toggle("show", window.scrollY > 400);
  }

  window.addEventListener("scroll", handleScroll, { passive: true });
  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    history.replaceState(null, "", window.location.pathname);
  });

  /* ── Fade-up on scroll ────────────────────────────────────────────── */
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll(".fade-up").forEach((el) => observer.observe(el));

  /* ── Education read more toggle ───────────────────────────────────── */
  document.querySelectorAll(".edu-desc-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const body = btn.closest(".edu-body");
      const full = body.querySelector(".edu-desc-full");
      const isOpen = full.classList.toggle("open");
      btn.textContent = isOpen ? "Show less ↑" : "Read more ↓";
    });
  });

  /* ── Contact form with EmailJS ────────────────────────────────────── */
  const form = document.getElementById("contactForm");

  function showToast(msg, type) {
    const t = document.getElementById("toast");
    t.textContent = msg;
    t.className = "toast " + type + " show";
    setTimeout(() => t.classList.remove("show"), 4000);
  }

  function validateField(input) {
    const err = input.parentElement.querySelector(".form-error");
    if (!input.value.trim()) {
      input.classList.add("error");
      if (err) err.classList.add("show");
      return false;
    }
    input.classList.remove("error");
    if (err) err.classList.remove("show");
    return true;
  }

  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      let valid = true;
      form.querySelectorAll("[required]").forEach((f) => {
        if (!validateField(f)) valid = false;
      });
      if (!valid) return;

      const btn = form.querySelector(".form-submit");
      btn.disabled = true;
      btn.innerHTML = '<span class="btn-spinner"></span> Sending…';

      // Try EmailJS first; fall back to Firestore if not configured
      const useEmailJS =
        typeof emailjs !== "undefined" &&
        EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY";

      if (useEmailJS) {
        /* ── EmailJS send ─────────────────────────────────────────── */
        const templateParams = {
          from_name:
            form.firstName.value.trim() + " " + form.lastName.value.trim(),
          from_email: form.email.value.trim(),
          phone: form.phone.value.trim() || "N/A",
          message: form.message.value.trim(),
          reply_to: form.email.value.trim(),
        };
        try {
          await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            templateParams
          );
          showToast("Message sent successfully! ✓", "success");
          form.reset();
        } catch (err) {
          console.error("EmailJS error:", err);
          showToast("Failed to send. Please try again.", "error");
        }
      } else {
        /* ── Firestore fallback ───────────────────────────────────── */
        const projectId = "hamzakhan-web";
        const url =
          "https://firestore.googleapis.com/v1/projects/" +
          projectId +
          "/databases/(default)/documents/messages";
        const body = {
          fields: {
            "first name": { stringValue: form.firstName.value.trim() },
            "last name": { stringValue: form.lastName.value.trim() },
            email: { stringValue: form.email.value.trim() },
            "phone number": { stringValue: form.phone.value.trim() },
            message: { stringValue: form.message.value.trim() },
            timestamp: { stringValue: new Date().toISOString() },
          },
        };
        try {
          const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });
          if (res.ok) {
            showToast("Message sent successfully", "success");
            form.reset();
          } else {
            throw new Error("fail");
          }
        } catch (_) {
          showToast("Failed to send. Please try again.", "error");
        }
      }

      btn.disabled = false;
      btn.textContent = "Send Message";
    });

    form.querySelectorAll("[required]").forEach((f) => {
      f.addEventListener("blur", () => validateField(f));
      f.addEventListener("input", () => {
        if (f.classList.contains("error")) validateField(f);
      });
    });
  }

  /* ── Typed role effect ────────────────────────────────────────────── */
  // Order: Software Engineer first, then the rest
  const roles = [
    "Software Engineer",
    "Flutter Mobile Developer",
    "iOS Developer",
    "Android App Developer",
    "Frontend Mobile Developer",
    "Cross Platform Developer",
  ];
  const typed = document.getElementById("typedRole");
  let ri = 0,
    ci = 0,
    deleting = false;

  function typeLoop() {
    if (!typed) return;
    const current = roles[ri];
    if (!deleting) {
      typed.textContent = current.slice(0, ++ci);
      if (ci === current.length) {
        deleting = true;
        setTimeout(typeLoop, 2000);
        return;
      }
    } else {
      typed.textContent = current.slice(0, --ci);
      if (ci === 0) {
        deleting = false;
        ri = (ri + 1) % roles.length;
      }
    }
    setTimeout(typeLoop, deleting ? 50 : 85);
  }

  typeLoop();

  /* ── Clean URL on load (remove any #hash) ────────────────────────── */
  if (window.location.hash) {
    history.replaceState(null, "", window.location.pathname);
  }
}); // end DOMContentLoaded
