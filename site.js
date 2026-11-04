(function () {
  /* Change status to "live" when a product launches.
     Leave every link empty until a real destination exists. */
  var projects = {
    nesto: {
      status: "coming-soon",
      links: {
        website: "",
        appStore: "",
        playStore: "",
        demo: ""
      },
      screenshots: [],
      updates: []
    }
  };

  var linkLabels = {
    website: "Website",
    appStore: "App Store",
    playStore: "Google Play",
    demo: "Demo"
  };

  function isHttps(url) {
    return typeof url === "string" && /^https:\/\/\S+$/.test(url);
  }

  function isSafeSrc(src) {
    if (typeof src !== "string" || !src) return false;
    if (/^https:\/\/\S+$/.test(src)) return true;
    return /^[a-z0-9_./-]+$/i.test(src) && src.indexOf("..") === -1;
  }

  function applyProjects() {
    var nodes = document.querySelectorAll("[data-project]");
    Array.prototype.forEach.call(nodes, function (node) {
      var entry = projects[node.getAttribute("data-project")];
      if (!entry) return;

      var status = entry.status === "live" ? "live" : "coming-soon";
      node.setAttribute("data-status", status);

      var label = node.querySelector("[data-status-label]");
      if (label) label.textContent = status === "live" ? "Live" : "Coming soon";

      Array.prototype.forEach.call(node.querySelectorAll("[data-when]"), function (el) {
        el.hidden = el.getAttribute("data-when") !== status;
      });

      var list = node.querySelector("[data-project-links]");
      if (list) {
        list.textContent = "";
        var added = 0;
        if (status === "live" && entry.links) {
          Object.keys(linkLabels).forEach(function (key) {
            var url = entry.links[key];
            if (!isHttps(url)) return;
            var item = document.createElement("li");
            var anchor = document.createElement("a");
            anchor.className = "button button-secondary";
            anchor.href = url;
            anchor.target = "_blank";
            anchor.rel = "noopener noreferrer";
            anchor.textContent = linkLabels[key];
            item.appendChild(anchor);
            list.appendChild(item);
            added += 1;
          });
        }
        list.hidden = added === 0;
      }

      var media = node.querySelector("[data-project-media]");
      if (media) {
        media.textContent = "";
        (entry.screenshots || []).forEach(function (shot) {
          if (!shot || !isSafeSrc(shot.src) || !shot.alt) return;
          var figure = document.createElement("figure");
          var image = document.createElement("img");
          image.src = shot.src;
          image.alt = shot.alt;
          figure.appendChild(image);
          media.appendChild(figure);
        });
        media.hidden = media.childElementCount === 0;
      }

      var notes = node.querySelector("[data-project-updates]");
      if (notes) {
        notes.textContent = "";
        (entry.updates || []).forEach(function (update) {
          if (!update || !update.text) return;
          var item = document.createElement("li");
          item.textContent = update.date ? update.date + " — " + update.text : update.text;
          notes.appendChild(item);
        });
        notes.hidden = notes.childElementCount === 0;
      }
    });
  }

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

  function init() {
    initNav();
    applyProjects();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
