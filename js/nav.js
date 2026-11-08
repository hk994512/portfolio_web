/* ══════════════════════════════════════════════════════════════
   NAVBAR BEHAVIOUR (shared by index.html and toolkit.html)
   1. Scroll down  → navbar slides up and hides
      Scroll up    → navbar slides back in
   2. Active link gets a dot underneath (CSS: .nav-links a.active::after)
      - on the home page it follows the section you are viewing
      - clicking a link moves the dot right away
   ══════════════════════════════════════════════════════════════ */
(function () {
  var nav = document.getElementById("navbar");
  if (!nav) return;

  var links = Array.prototype.slice.call(nav.querySelectorAll(".nav-links a"));

  /* Links that point at a section on THIS page (href="#services" …) */
  var sections = [];
  links.forEach(function (link) {
    var href = link.getAttribute("href") || "";
    if (href.length > 1 && href.charAt(0) === "#") {
      var el = document.getElementById(href.slice(1));
      if (el) sections.push({ el: el, link: link });
    }
  });

  function setActive(active) {
    if (!sections.length) return; // e.g. toolkit page: keep the hard-coded .active
    sections.forEach(function (s) {
      var on = s.link === active;
      s.link.classList.toggle("active", on);
      if (on) s.link.setAttribute("aria-current", "true");
      else s.link.removeAttribute("aria-current");
    });
  }

  /* ── Scroll spy ─────────────────────────────────────────── */
  function spy() {
    if (!sections.length) return;
    var probe = window.innerHeight * 0.35;
    var current = null;
    sections.forEach(function (s) {
      if (s.el.getBoundingClientRect().top <= probe) current = s.link;
    });
    var atBottom =
      window.innerHeight + window.pageYOffset >=
      document.documentElement.scrollHeight - 4;
    if (atBottom) current = sections[sections.length - 1].link;
    setActive(current);
  }

  /* ── Hide on scroll down, show on scroll up ─────────────── */
  var lastY = window.pageYOffset;
  var locked = false;
  var lockTimer = null;
  var ticking = false;

  function handleScroll() {
    var y = Math.max(window.pageYOffset, 0);

    if (!locked) {
      var delta = y - lastY;
      if (y < 80) {
        nav.classList.remove("nav-hidden");
      } else if (Math.abs(delta) > 6) {
        nav.classList.toggle("nav-hidden", delta > 0);
      }
    }
    if (Math.abs(y - lastY) > 6 || y < 80) lastY = y;

    spy();
    ticking = false;
  }

  window.addEventListener(
    "scroll",
    function () {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(handleScroll);
      }
    },
    { passive: true },
  );

  /* ── Clicking a link: move the dot now and keep the bar
        visible while the page scrolls to the section ────── */
  links.forEach(function (link) {
    link.addEventListener("click", function () {
      var match = sections.filter(function (s) {
        return s.link === link;
      })[0];
      if (match) setActive(link);

      locked = true;
      nav.classList.remove("nav-hidden");
      clearTimeout(lockTimer);
      lockTimer = setTimeout(function () {
        locked = false;
        lastY = window.pageYOffset;
      }, 1100);
    });
  });

  /* Keyboard users tabbing into the bar always see it */
  nav.addEventListener("focusin", function () {
    nav.classList.remove("nav-hidden");
  });

  spy();
})();
