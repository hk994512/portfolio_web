
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
    const bar     = document.getElementById("splashBar");
    const counter = document.getElementById("splashCounter");
    const DURATION = 1600; // ms — matches total reveal time
    const DELAY    = 300;  // slight delay before bar starts

    setTimeout(function () {
      const start = performance.now();

      function easeOut(t) {
        // Slow down near 100% (mirrors the CSS 80%→100% slowdown)
        return t < 0.8 ? t / 0.8 * 0.88 : 0.88 + ((t - 0.8) / 0.2) * 0.12;
      }

      function tick(now) {
        const elapsed = Math.min(now - start, DURATION);
        const t       = elapsed / DURATION;
        const pct     = Math.round(easeOut(t) * 100);

        if (bar)     bar.style.width   = pct + "%";
        if (counter) counter.textContent = pct + "%";

        if (elapsed < DURATION) {
          requestAnimationFrame(tick);
        } else {
          if (bar)     bar.style.width   = "100%";
          if (counter) counter.textContent = "100%";
        }
      }

      requestAnimationFrame(tick);
    }, DELAY);

    // After loading finishes, zoom-out splash and reveal page
    setTimeout(function () {
      splash.classList.add("hide");
      document.body.style.overflow = "";
      setTimeout(function () { splash.style.display = "none"; }, 550);
    }, 1800);
  }

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

  if (typeof emailjs !== "undefined" && EMAILJS_PUBLIC_KEY && EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY") {
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
  const navLinks = document.querySelectorAll(".nav-links a, .mobile-nav a");

  function setActiveNav() {
    // Force contact active if user is scrolled to the absolute bottom of page
    const isAtBottom = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 5);
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

  /* ══════════════════════════════════════════════════════════════════
     HELPER — read the currently selected country code + name
     from the phone picker rendered in index.html.
     Returns an object: { dialCode: "+92", countryName: "Pakistan" }
  ══════════════════════════════════════════════════════════════════ */
  function getSelectedCountry() {
    const codeEl = document.getElementById("selectedCode");
    const flagImg = document.getElementById("selectedFlagImg");
    return {
      dialCode: codeEl ? codeEl.textContent.trim() : "",
      countryName: flagImg ? flagImg.getAttribute("alt") || "" : "",
    };
  }

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

      // ── Read country picker values ─────────────────────────────────
      const { dialCode, countryName } = getSelectedCountry();
      const rawPhone = form.phone.value.trim();
      // Full phone combines dial code + number, e.g. "+92 3001234567"
      const fullPhone = rawPhone ? dialCode + " " + rawPhone : dialCode;

      const useEmailJS =
        typeof emailjs !== "undefined" &&
        EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY";

      if (useEmailJS) {
        /* ── EmailJS send ─────────────────────────────────────────── */
        const templateParams = {
          from_name:
            form.firstName.value.trim() + " " + form.lastName.value.trim(),
          from_email: form.email.value.trim(),
          phone: fullPhone || "N/A",
          country_code: dialCode || "N/A",
          country: countryName || "N/A",
          message: form.message.value.trim(),
          reply_to: form.email.value.trim(),
        };
        try {
          await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            templateParams,
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
            // Country name resolved from flag alt text, e.g. "Pakistan"
            country: { stringValue: countryName },
            // Dial code only, e.g. "+92"
            "country code": { stringValue: dialCode },
            // Raw number typed by the user, e.g. "3001234567"
            "phone number": { stringValue: rawPhone },
            // Dial code + number combined, e.g. "+92 3001234567"
            "full phone": { stringValue: fullPhone },
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

  /* ── Custom Cursor Logic ─────────────────────────────────────────── */
  const cursor = document.getElementById("customCursor");
  const follower = document.getElementById("customCursorFollower");

  if (cursor && follower && window.matchMedia("(pointer: fine)").matches) {
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let followerX = 0, followerY = 0;
    let isVisible = false;

    window.addEventListener("mousemove", function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        cursor.style.opacity = "1";
        follower.style.opacity = "1";
        isVisible = true;
      }
    });

    function updateCursorPosition() {
      // Small dot follows with standard interpolation
      cursorX += (mouseX - cursorX) * 0.22;
      cursorY += (mouseY - cursorY) * 0.22;

      // Follower follows with more inertia (lag)
      followerX += (mouseX - followerX) * 0.12;
      followerY += (mouseY - followerY) * 0.12;

      // Update CSS variables
      cursor.style.setProperty("--cursor-x", cursorX + "px");
      cursor.style.setProperty("--cursor-y", cursorY + "px");
      follower.style.setProperty("--follower-x", followerX + "px");
      follower.style.setProperty("--follower-y", followerY + "px");

      requestAnimationFrame(updateCursorPosition);
    }
    requestAnimationFrame(updateCursorPosition);

    // Active hover targets
    const hoverSelectors = 'a, button, select, [role="button"], .work-card, .service-card, .edu-card, .t-card, .phone-flag-btn, .hamburger, .social-btn, .work-btn, .btn, .btn-book';
    const hideCursorSelectors = 'input, textarea';

    document.addEventListener("mouseover", function (e) {
      if (e.target.closest(hideCursorSelectors)) {
        cursor.style.opacity = "0";
        follower.style.opacity = "0";
      } else if (e.target.closest(hoverSelectors)) {
        cursor.classList.add("hovered");
        follower.classList.add("hovered");
        if (isVisible) {
          cursor.style.opacity = "1";
          follower.style.opacity = "1";
        }
      } else {
        if (isVisible) {
          cursor.style.opacity = "1";
          follower.style.opacity = "1";
        }
      }
    });

    document.addEventListener("mouseout", function (e) {
      if (e.target.closest(hideCursorSelectors)) {
        if (isVisible) {
          cursor.style.opacity = "1";
          follower.style.opacity = "1";
        }
      }
      if (!e.target.closest(hoverSelectors) || (e.relatedTarget && !e.relatedTarget.closest(hoverSelectors))) {
        cursor.classList.remove("hovered");
        follower.classList.remove("hovered");
      }
    });

    // Handle clicks
    window.addEventListener("mousedown", function () {
      cursor.classList.add("clicked");
      follower.classList.add("clicked");
    });

    window.addEventListener("mouseup", function () {
      cursor.classList.remove("clicked");
      follower.classList.remove("clicked");
    });

    // Hide if mouse leaves document
    document.addEventListener("mouseleave", function () {
      cursor.style.opacity = "0";
      follower.style.opacity = "0";
      isVisible = false;
    });
  }

  /* ── Clean URL on load (remove any #hash) ────────────────────────── */
  if (window.location.hash) {
    history.replaceState(null, "", window.location.pathname);
  }
}); // end DOMContentLoaded
