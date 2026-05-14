(function () {
  var tracks = document.querySelectorAll(".testimonials-track");
  tracks.forEach(function (track) {
    // Pause on mouse enter
    track.addEventListener("mouseenter", function () {
      track.style.animationPlayState = "paused";
    });
    track.addEventListener("mouseleave", function () {
      track.style.animationPlayState = "running";
    });
  });

  // Respect reduced-motion preference
  var mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  function applyMotion() {
    tracks.forEach(function (t) {
      t.style.animationDuration = mq.matches ? "0s" : "";
      t.style.animationPlayState = mq.matches ? "paused" : "running";
    });
  }
  mq.addEventListener("change", applyMotion);
  applyMotion();
})();
