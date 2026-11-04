(function () {
  function initNav() {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.getElementById("site-nav");
    if (!toggle || !nav || toggle.dataset.bound === "true") return;
    toggle.dataset.bound = "true";

    var label = toggle.querySelector("[data-nav-label]");
    var desktop = window.matchMedia("(min-width: 980px)");

    function setOpen(open) {
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      if (open) nav.classList.add("is-open");
      else nav.classList.remove("is-open");
      document.body.classList.toggle("nav-open", open);
      if (label) label.textContent = open ? "Close" : "Menu";
    }

    toggle.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) setOpen(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        toggle.focus();
      }
    });

    document.addEventListener("click", function (event) {
      if (toggle.getAttribute("aria-expanded") !== "true") return;
      if (toggle.contains(event.target) || nav.contains(event.target)) return;
      setOpen(false);
    });

    if (typeof desktop.addEventListener === "function") {
      desktop.addEventListener("change", function (event) {
        if (event.matches) setOpen(false);
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initNav);
  } else {
    initNav();
  }
})();
