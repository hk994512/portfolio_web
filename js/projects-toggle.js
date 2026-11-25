// "View All Projects" button for the #works section
(function () {
  // Number of projects visible before clicking the button
  var INITIAL_COUNT = 3;
  // true: the FEATURED project stays first. false: shuffle it too
  var KEEP_FEATURED_FIRST = true;

  var grid = document.querySelector("#works .works-grid");
  if (!grid) return;

  var cards = Array.prototype.slice.call(grid.querySelectorAll(".work-card"));

  // New random order on every page load (Fisher-Yates shuffle)
  function shuffle(list) {
    for (var i = list.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = list[i];
      list[i] = list[j];
      list[j] = temp;
    }
    return list;
  }

  function isPinned(card) {
    return KEEP_FEATURED_FIRST && card.classList.contains("featured");
  }

  var pinned = cards.filter(isPinned);
  var others = cards.filter(function (card) {
    return !isPinned(card);
  });
  cards = pinned.concat(shuffle(others));

  cards.forEach(function (card, index) {
    grid.appendChild(card); // moves the card into its new position

    // Keep numbers and animation delays in on-screen order
    var number = card.querySelector(".work-number");
    if (number) number.textContent = ("0" + (index + 1)).slice(-2);
    card.style.transitionDelay = (index + 1) * 0.05 + "s";
  });

  if (cards.length <= INITIAL_COUNT) return;

  var extraCards = cards.slice(INITIAL_COUNT);
  var expanded = false;

  grid.id = grid.id || "worksGrid";

  var wrap = document.createElement("div");
  wrap.className = "works-toggle-wrap";

  var button = document.createElement("button");
  button.type = "button";
  button.className = "btn btn-outline works-toggle";
  button.setAttribute("aria-controls", grid.id);

  wrap.appendChild(button);
  grid.insertAdjacentElement("afterend", wrap);

  function render() {
    extraCards.forEach(function (card, index) {
      card.classList.toggle("is-hidden", !expanded);
      card.classList.toggle("is-revealed", expanded);
      if (expanded) {
        // Don't depend on the scroll animation to make these cards visible
        card.classList.remove("fade-up");
        card.style.animationDelay = index * 0.08 + "s";
      }
    });

    button.textContent = expanded
      ? "Show Less"
      : "View All Projects (" + cards.length + ")";
    button.setAttribute("aria-expanded", String(expanded));
  }

  button.addEventListener("click", function () {
    expanded = !expanded;
    render();

    // After collapsing, keep the button on screen
    if (!expanded) {
      button.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });

  render();
})();
