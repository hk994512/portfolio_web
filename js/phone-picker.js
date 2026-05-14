(function () {
  "use strict";
  var C = [
    ["Afghanistan", "93", "af"],
    ["Albania", "355", "al"],
    ["Algeria", "213", "dz"],
    ["Andorra", "376", "ad"],
    ["Angola", "244", "ao"],
    ["Argentina", "54", "ar"],
    ["Armenia", "374", "am"],
    ["Australia", "61", "au"],
    ["Austria", "43", "at"],
    ["Azerbaijan", "994", "az"],
    ["Bahrain", "973", "bh"],
    ["Bangladesh", "880", "bd"],
    ["Belarus", "375", "by"],
    ["Belgium", "32", "be"],
    ["Belize", "501", "bz"],
    ["Benin", "229", "bj"],
    ["Bhutan", "975", "bt"],
    ["Bolivia", "591", "bo"],
    ["Bosnia", "387", "ba"],
    ["Brazil", "55", "br"],
    ["Brunei", "673", "bn"],
    ["Bulgaria", "359", "bg"],
    ["Burkina Faso", "226", "bf"],
    ["Cambodia", "855", "kh"],
    ["Cameroon", "237", "cm"],
    ["Canada", "1", "ca"],
    ["Chile", "56", "cl"],
    ["China", "86", "cn"],
    ["Colombia", "57", "co"],
    ["Congo", "243", "cd"],
    ["Costa Rica", "506", "cr"],
    ["Croatia", "385", "hr"],
    ["Cuba", "53", "cu"],
    ["Cyprus", "357", "cy"],
    ["Czech Republic", "420", "cz"],
    ["Denmark", "45", "dk"],
    ["Ecuador", "593", "ec"],
    ["Egypt", "20", "eg"],
    ["El Salvador", "503", "sv"],
    ["Estonia", "372", "ee"],
    ["Ethiopia", "251", "et"],
    ["Finland", "358", "fi"],
    ["France", "33", "fr"],
    ["Georgia", "995", "ge"],
    ["Germany", "49", "de"],
    ["Ghana", "233", "gh"],
    ["Greece", "30", "gr"],
    ["Guatemala", "502", "gt"],
    ["Honduras", "504", "hn"],
    ["Hong Kong", "852", "hk"],
    ["Hungary", "36", "hu"],
    ["Iceland", "354", "is"],
    ["India", "91", "in"],
    ["Indonesia", "62", "id"],
    ["Iran", "98", "ir"],
    ["Iraq", "964", "iq"],
    ["Ireland", "353", "ie"],
    ["Italy", "39", "it"],
    ["Jamaica", "1876", "jm"],
    ["Japan", "81", "jp"],
    ["Jordan", "962", "jo"],
    ["Kazakhstan", "7", "kz"],
    ["Kenya", "254", "ke"],
    ["Kuwait", "965", "kw"],
    ["Kyrgyzstan", "996", "kg"],
    ["Latvia", "371", "lv"],
    ["Lebanon", "961", "lb"],
    ["Libya", "218", "ly"],
    ["Lithuania", "370", "lt"],
    ["Luxembourg", "352", "lu"],
    ["Malaysia", "60", "my"],
    ["Maldives", "960", "mv"],
    ["Mali", "223", "ml"],
    ["Malta", "356", "mt"],
    ["Mexico", "52", "mx"],
    ["Moldova", "373", "md"],
    ["Mongolia", "976", "mn"],
    ["Morocco", "212", "ma"],
    ["Mozambique", "258", "mz"],
    ["Myanmar", "95", "mm"],
    ["Nepal", "977", "np"],
    ["Netherlands", "31", "nl"],
    ["New Zealand", "64", "nz"],
    ["Nicaragua", "505", "ni"],
    ["Nigeria", "234", "ng"],
    ["North Korea", "850", "kp"],
    ["Norway", "47", "no"],
    ["Oman", "968", "om"],
    ["Pakistan", "92", "pk"],
    ["Palestine", "970", "ps"],
    ["Panama", "507", "pa"],
    ["Paraguay", "595", "py"],
    ["Peru", "51", "pe"],
    ["Philippines", "63", "ph"],
    ["Poland", "48", "pl"],
    ["Portugal", "351", "pt"],
    ["Qatar", "974", "qa"],
    ["Romania", "40", "ro"],
    ["Russia", "7", "ru"],
    ["Rwanda", "250", "rw"],
    ["Saudi Arabia", "966", "sa"],
    ["Senegal", "221", "sn"],
    ["Serbia", "381", "rs"],
    ["Singapore", "65", "sg"],
    ["Slovakia", "421", "sk"],
    ["Slovenia", "386", "si"],
    ["Somalia", "252", "so"],
    ["South Africa", "27", "za"],
    ["South Korea", "82", "kr"],
    ["Spain", "34", "es"],
    ["Sri Lanka", "94", "lk"],
    ["Sudan", "249", "sd"],
    ["Sweden", "46", "se"],
    ["Switzerland", "41", "ch"],
    ["Syria", "963", "sy"],
    ["Taiwan", "886", "tw"],
    ["Tajikistan", "992", "tj"],
    ["Tanzania", "255", "tz"],
    ["Thailand", "66", "th"],
    ["Tunisia", "216", "tn"],
    ["Turkey", "90", "tr"],
    ["Turkmenistan", "993", "tm"],
    ["Uganda", "256", "ug"],
    ["Ukraine", "380", "ua"],
    ["UAE", "971", "ae"],
    ["United Kingdom", "44", "gb"],
    ["United States", "1", "us"],
    ["Uruguay", "598", "uy"],
    ["Uzbekistan", "998", "uz"],
    ["Venezuela", "58", "ve"],
    ["Vietnam", "84", "vn"],
    ["Yemen", "967", "ye"],
    ["Zambia", "260", "zm"],
    ["Zimbabwe", "263", "zw"],
  ];
  var flagBtn = document.getElementById("phoneFlagBtn"),
    flagImgEl = document.getElementById("selectedFlagImg"),
    codeEl = document.getElementById("selectedCode"),
    phoneEl = document.getElementById("phone");
  if (!flagBtn) return;
  var selected = null,
    popup = null,
    isOpen = false;
  for (var i = 0; i < C.length; i++) {
    if (C[i][2] === "pk") {
      selected = C[i];
      break;
    }
  }
  function flagSrc(iso) {
    return "https://flagcdn.com/w40/" + iso + ".png";
  }
  function createPopup() {
    popup = document.createElement("div");
    popup.className = "phone-popup";
    popup.setAttribute("role", "dialog");
    popup.setAttribute("aria-label", "Select country code");
    var sw = document.createElement("div");
    sw.className = "phone-popup-search";
    var si = document.createElement("input");
    si.type = "text";
    si.className = "phone-popup-search-input";
    si.placeholder = "Search country or code...";
    sw.appendChild(si);
    popup.appendChild(sw);
    var le = document.createElement("div");
    le.className = "phone-popup-list";
    le.setAttribute("role", "listbox");
    popup.appendChild(le);
    document.body.appendChild(popup);
    var db;
    si.addEventListener("input", function () {
      clearTimeout(db);
      db = setTimeout(function () {
        renderList(le, si.value);
      }, 100);
    });
    si.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        doClose();
        flagBtn.focus();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        var f = le.querySelector(".phone-popup-item");
        if (f) f.focus();
      }
    });
    le.addEventListener("click", function (e) {
      var item = e.target.closest(".phone-popup-item");
      if (item) doSelect(item.getAttribute("data-iso"));
    });
    le.addEventListener("keydown", function (e) {
      var items = le.querySelectorAll(".phone-popup-item");
      var arr = Array.prototype.slice.call(items);
      var idx = arr.indexOf(document.activeElement);
      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (idx < arr.length - 1) arr[idx + 1].focus();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (idx > 0) arr[idx - 1].focus();
        else si.focus();
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (idx >= 0) doSelect(arr[idx].getAttribute("data-iso"));
      } else if (e.key === "Escape") {
        doClose();
        flagBtn.focus();
      }
    });
  }
  function renderList(le, q) {
    q = (q || "").toLowerCase().replace(/^\+/, "").trim();
    var filtered = q
      ? C.filter(function (c) {
        return (
          c[0].toLowerCase().indexOf(q) !== -1 || c[1].indexOf(q) === 0
        );
      })
      : C;
    if (!filtered.length) {
      le.innerHTML =
        '<div class="phone-popup-empty">No country found</div>';
      return;
    }
    var html = "";
    for (var i = 0; i < filtered.length; i++) {
      var c = filtered[i],
        sc = selected && c[2] === selected[2] ? " selected" : "";
      html +=
        '<div class="phone-popup-item' +
        sc +
        '" role="option" aria-selected="' +
        (sc ? "true" : "false") +
        '" data-iso="' +
        c[2] +
        '" tabindex="0"><img class="flag-img" src="' +
        flagSrc(c[2]) +
        '" alt="" /><span class="pp-name">' +
        c[0] +
        '</span><span class="pp-code">+' +
        c[1] +
        "</span></div>";
    }
    le.innerHTML = html;
  }
  function positionPopup() {
    popup.style.left = "50%";
    popup.style.top = "50%";
    popup.style.transform = "translate(-50%, -50%)";
  }
  function doSelect(iso) {
    for (var i = 0; i < C.length; i++) {
      if (C[i][2] === iso) {
        selected = C[i];
        flagImgEl.src = flagSrc(iso);
        flagImgEl.alt = C[i][0];
        codeEl.textContent = "+" + C[i][1];
        doClose();
        setTimeout(function () {
          phoneEl.focus();
        }, 50);
        return;
      }
    }
  }
  function doOpen() {
    if (isOpen) return;
    if (!popup) createPopup();
    isOpen = true;
    popup.querySelector(".phone-popup-search-input").value = "";
    renderList(popup.querySelector(".phone-popup-list"), "");
    positionPopup();
    popup.classList.add("open");
    flagBtn.classList.add("open");
    flagBtn.setAttribute("aria-expanded", "true");
    setTimeout(function () {
      popup.querySelector(".phone-popup-search-input").focus();
    }, 100);
  }
  function doClose() {
    if (!isOpen) return;
    isOpen = false;
    popup.classList.remove("open");
    flagBtn.classList.remove("open");
    flagBtn.setAttribute("aria-expanded", "false");
  }
  flagBtn.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    isOpen ? doClose() : doOpen();
  });
  document.addEventListener("click", function (e) {
    if (isOpen && !popup.contains(e.target) && e.target !== flagBtn)
      doClose();
  });
  window.addEventListener("resize", function () {
    if (isOpen) positionPopup();
  });
})();
