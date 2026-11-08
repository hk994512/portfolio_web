/**
 * ══════════════════════════════════════════════════════════════
 * THEME CONTROLLER (Shared by index.html and toolkit.html)
 * 1. Immediate theme restoration from localStorage (prevents FOUT)
 * 2. Mobile address bar theme-color synchronization
 * 3. Theme toggle button handler
 * ══════════════════════════════════════════════════════════════
 */
(function () {
  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute("content", theme === "light" ? "#f8fafc" : "#050607");
    }
  }

  // 1. Restore saved theme immediately on parse
  try {
    var savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      applyTheme(savedTheme);
    }
  } catch (e) {}

  // 2. Attach toggle event listener once DOM is ready
  function initThemeToggle() {
    var btn = document.getElementById("themeToggle");
    if (!btn) return;

    btn.addEventListener("click", function () {
      var current = document.documentElement.getAttribute("data-theme");
      var next = current === "light" ? "dark" : "light";
      applyTheme(next);
      try {
        localStorage.setItem("theme", next);
      } catch (e) {}
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initThemeToggle);
  } else {
    initThemeToggle();
  }
})();

