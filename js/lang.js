(function () {
  const CIRCUMFERENCE = 2 * Math.PI * 32;

  function animateCircles() {
    document.querySelectorAll(".skill-circle-wrap").forEach(function (wrap, i) {
      const percent = parseFloat(wrap.dataset.percent) || 0;
      const color = wrap.dataset.color || "#00B4AB";
      const prog = wrap.querySelector(".progress");

      prog.style.stroke = color;

      // Staggered delay per circle
      setTimeout(function () {
        wrap.classList.add("animated");
        const offset = CIRCUMFERENCE - (percent / 100) * CIRCUMFERENCE;
        prog.style.strokeDashoffset = offset;
      }, i * 150); // 150ms stagger between each circle
    });
  }

  const section = document.getElementById("skillsCircles");
  if (!section) return;

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCircles();
          observer.disconnect();
        }
      });
    },
    { threshold: 0.3 },
  );

  observer.observe(section);
})();
