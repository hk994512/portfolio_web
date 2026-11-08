document.addEventListener("DOMContentLoaded", function () {
  /* ── Splash Screen ────────────────────────────────────────────────── */
  const splash = document.getElementById("splashScreen");
  if (splash) {
    // Lock scroll while splash is visible
    document.body.style.overflow = "hidden";
    document.body.style.opacity = "0";

    // Show the body (splash sits on top at z-index 9999)
    setTimeout(function () {
      document.body.style.transition = "opacity 0.01s";
      document.body.style.opacity = "1";
    }, 50);

    // Animate loading bar + live counter via requestAnimationFrame
    const bar = document.getElementById("splashBar");
    const counter = document.getElementById("splashCounter");
    const DURATION = 1600; // ms — matches total reveal time
    const DELAY = 300; // slight delay before bar starts

    setTimeout(function () {
      const start = performance.now();

      function easeOut(t) {
        // Slow down near 100% (mirrors the CSS 80%→100% slowdown)
        return t < 0.8 ? (t / 0.8) * 0.88 : 0.88 + ((t - 0.8) / 0.2) * 0.12;
      }

      function tick(now) {
        const elapsed = Math.min(now - start, DURATION);
        const t = elapsed / DURATION;
        const pct = Math.round(easeOut(t) * 100);

        if (bar) bar.style.width = pct + "%";
        if (counter) counter.textContent = pct + "%";

        if (elapsed < DURATION) {
          requestAnimationFrame(tick);
        } else {
          if (bar) bar.style.width = "100%";
          if (counter) counter.textContent = "100%";
        }
      }

      requestAnimationFrame(tick);
    }, DELAY);

    // After loading finishes, zoom-out splash and reveal page
    setTimeout(function () {
      splash.classList.add("hide");
      document.body.style.overflow = "";
      setTimeout(function () {
        splash.style.display = "none";
      }, 550);
    }, 1800);
  }

  /* ══════════════════════════════════════════════════════════════════
     FIREBASE / FIRESTORE — SETUP
     1. Go to https://console.firebase.google.com → create/open a project
     2. Build → Firestore Database → Create database (production mode)
     3. Firestore → Rules tab → paste the "messages" create-only rule
        (see the chat message that came with this file)
     4. Project Settings → General → Your apps → Add app (Web) → copy
        the firebaseConfig object it gives you and paste it below
     5. In index.html <head>, add before main.js:
        <script src="https://www.gstatic.com/firebasejs/10.13.0/firebase-app-compat.js"></script>
        <script src="https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore-compat.js"></script>
  ══════════════════════════════════════════════════════════════════ */
  const firebaseConfig = {
    apiKey: "AIzaSyALH79fe9yy8fJZldQgXOA5U4wPRgVL_7s",
    authDomain: "hamzakhan-web.firebaseapp.com",
    projectId: "hamzakhan-web",
    storageBucket: "hamzakhan-web.firebasestorage.app",
    messagingSenderId: "964601477858",
    appId: "1:964601477858:web:6e22b2fc1f8030052fbcbb",
  };

  const firebaseReady =
    typeof firebase !== "undefined" && firebaseConfig.apiKey !== "YOUR_API_KEY";

  let db = null;
  if (firebaseReady) {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
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

  /* ── Navbar / scroll-to-top button (optional element) ───────────── */
  const scrollTopBtn = document.getElementById("scrollTop");

  /* ── Smooth scroll WITHOUT hash in URL ───────────────────────────── */
  document.querySelectorAll('a[href^="#"], a[data-section]').forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      const section = this.getAttribute("data-section");

      let targetId = null;
      if (section === "hero" || href === "#" || href === "#hero") {
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
                "--nav-h",
              ),
            ) || 68;
          const top =
            target.getBoundingClientRect().top + window.scrollY - navH;
          window.scrollTo({ top, behavior: "smooth" });
          history.pushState(null, "", window.location.pathname);
        }
      }
    });
  });

  /* ── Active nav on scroll ─────────────────────────────────────────── */
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-links a");

  function setActiveNav() {
    // Force contact active if user is scrolled to the absolute bottom of page
    const isAtBottom =
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 5;
    if (isAtBottom) {
      navLinks.forEach((a) => {
        a.classList.remove("active");
        const aSection = a.getAttribute("data-section");
        const aHref = a.getAttribute("href");
        if (aSection === "contact" || aHref === "#contact") {
          a.classList.add("active");
        }
      });
      return;
    }

    const scrollY = window.scrollY + 90;
    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute("id");
      if (scrollY >= top && scrollY < top + height) {
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
    if (scrollTopBtn) {
      scrollTopBtn.classList.toggle("show", window.scrollY > 400);
    }
  }

  window.addEventListener("scroll", handleScroll, { passive: true });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      history.replaceState(null, "", window.location.pathname);
    });
  }

  /* ── Fade-up on scroll ────────────────────────────────────────────── */
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.1 },
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

  /* ── Character counter for message textarea ─────────────────────── */
  const msgArea = document.getElementById("message");
  const charCount = document.getElementById("charCount");
  if (msgArea && charCount) {
    msgArea.addEventListener("input", () => {
      charCount.textContent = msgArea.value.length;
    });
  }

  /* ── Contact form with EmailJS ────────────────────────────────────── */
  /* Form has only two fields: email and message. There is no phone
     field in the HTML, so it must never be referenced here — doing so
     throws a TypeError and silently breaks the whole submit handler. */
  const form = document.getElementById("contactForm");

  function showFeedback(msg, type) {
    const box = document.getElementById("formFeedback");
    const icon = document.getElementById("formFeedbackIcon");
    const text = document.getElementById("formFeedbackMsg");
    if (!box) return;
    box.className = "form-feedback " + type + " show";
    icon.textContent = type === "success" ? "✓" : "✕";
    text.textContent = msg;
    setTimeout(() => { box.className = "form-feedback"; }, 5000);
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
      const btnLabel = btn.querySelector(".btn-label");
      btn.disabled = true;
      if (btnLabel) {
        btnLabel.textContent = "Sending…";
      } else {
        btn.innerHTML = '<span class="btn-spinner"></span> Sending…';
      }

      const email = form.email.value.trim();
      const message = form.message.value.trim();

      if (firebaseReady && db) {
        /* ── Firestore send ───────────────────────────────────────── */
        try {
          await db.collection("messages").add({
            email: email,
            message: message,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          });
          showFeedback("Message sent! I'll get back to you within 24 hours.", "success");
          form.reset();
        } catch (err) {
          console.error("Firestore error:", err);
          showFeedback("Failed to send. Please try again.", "error");
        }
      } else {
        /* Firebase config is still placeholders — nothing is set up
           to actually store the message yet. Tell the visitor plainly
           instead of pretending it sent. */
        console.warn(
          "Firestore is not configured yet — set firebaseConfig in main.js.",
        );
        showFeedback(
          "Contact form isn't set up yet — please email me directly.",
          "error"
        );
      }

      btn.disabled = false;
      if (btnLabel) {
        btnLabel.textContent = "Send Message";
      } else {
        btn.textContent = "Send Message";
      }
    });

    form.querySelectorAll("[required]").forEach((f) => {
      f.addEventListener("blur", () => validateField(f));
      f.addEventListener("input", () => {
        if (f.classList.contains("error")) validateField(f);
      });
    });
  }

  /* ── Typed role effect ────────────────────────────────────────────── */
  const roles = ["Flutter Developer", "Mobile Engineer", "iOS & Android"];
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
