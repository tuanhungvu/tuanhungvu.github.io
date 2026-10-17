(function () {
  var root = document.documentElement;

  // Theme toggle: follows the OS until the visitor picks one.
  var toggle = document.querySelector(".theme-toggle");
  function isDark() {
    var t = root.getAttribute("data-theme");
    if (t) return t === "dark";
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  function syncIcon() {
    if (!toggle) return;
    toggle.innerHTML = isDark()
      ? '<i class="fa-solid fa-sun" aria-hidden="true"></i>'
      : '<i class="fa-solid fa-moon" aria-hidden="true"></i>';
  }
  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = isDark() ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
      syncIcon();
    });
    syncIcon();
  }

  // Publication filter: Selected / All.
  var pubs = document.querySelector(".pubs");
  var buttons = document.querySelectorAll("[data-filter]");
  if (pubs && buttons.length) {
    pubs.querySelectorAll(".pubs__year").forEach(function (y) {
      if (!y.querySelector(".pub.is-selected")) y.classList.add("is-empty");
    });
    var setMode = function (mode) {
      pubs.setAttribute("data-mode", mode);
      buttons.forEach(function (b) {
        b.setAttribute("aria-pressed", String(b.getAttribute("data-filter") === mode));
      });
    };
    buttons.forEach(function (b) {
      b.addEventListener("click", function () { setMode(b.getAttribute("data-filter")); });
    });
    setMode("selected");
  }

  // Highlight the nav link of the section in view.
  var links = document.querySelectorAll(".nav a");
  if ("IntersectionObserver" in window && links.length) {
    var map = {};
    links.forEach(function (a) {
      var id = a.getAttribute("href").split("#")[1];
      var el = id && document.getElementById(id);
      if (el) map[id] = a;
    });
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        if (window.scrollY < 80 && e.target.id !== "about") return;
        links.forEach(function (a) { a.classList.remove("is-active"); });
        if (map[e.target.id]) map[e.target.id].classList.add("is-active");
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    Object.keys(map).forEach(function (id) { obs.observe(document.getElementById(id)); });
  }
})();
