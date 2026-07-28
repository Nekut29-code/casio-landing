/**
 * Casio premium landing — shared interactions
 */
(function () {
  "use strict";

  /* ---------- Page enter ---------- */
  document.body.classList.add("page-enter");

  /* ---------- Transition overlay ---------- */
  var overlay = document.createElement("div");
  overlay.className = "page-transition";
  overlay.setAttribute("aria-hidden", "true");
  document.body.appendChild(overlay);

  function navigateWithTransition(href) {
    if (!href || href.startsWith("#") || href.startsWith("mailto:")) return;
    var current = window.location.pathname.split("/").pop() || "index.html";
    var target = href.split("#")[0].split("/").pop() || "index.html";
    if (current === target && href.indexOf("#") === -1) return;

    document.body.classList.add("page-exit");
    overlay.classList.add("is-active");
    setTimeout(function () {
      window.location.href = href;
    }, 380);
  }

  document.addEventListener("click", function (e) {
    var link = e.target.closest("a[href]");
    if (!link) return;
    var href = link.getAttribute("href");
    if (!href || link.target === "_blank" || href.startsWith("http") || href.startsWith("mailto:")) {
      return;
    }
    // In-page anchors: smooth scroll without page transition
    if (href.startsWith("#")) {
      var anchor = document.querySelector(href);
      if (anchor) {
        e.preventDefault();
        anchor.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      return;
    }
    // Same-origin relative page links
    if (/\.html(\?|#|$)/.test(href) || href === "/" || href.indexOf("watch.html") !== -1 || href.indexOf("best-sellers") !== -1 || href.indexOf("index") !== -1) {
      e.preventDefault();
      navigateWithTransition(href);
    }
  });

  /* ---------- Nav scroll + mobile ---------- */
  var nav = document.querySelector(".nav");
  var toggle = document.querySelector(".nav__toggle");
  var links = document.querySelector(".nav__links");

  function onScroll() {
    if (!nav) return;
    nav.classList.toggle("is-scrolled", window.scrollY > 24);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var scrollLockY = 0;

  function setMenuOpen(open) {
    if (!toggle || !links) return;
    links.classList.toggle("is-open", open);
    toggle.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) {
      scrollLockY = window.scrollY || window.pageYOffset || 0;
      document.body.classList.add("nav-open");
      document.body.style.top = "-" + scrollLockY + "px";
    } else {
      document.body.classList.remove("nav-open");
      document.body.style.top = "";
      window.scrollTo(0, scrollLockY);
    }
  }

  if (toggle && links) {
    toggle.addEventListener("click", function () {
      setMenuOpen(!links.classList.contains("is-open"));
    });

    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        setMenuOpen(false);
      });
    });

    // Close menu on orientation / resize to desktop
    window.addEventListener(
      "resize",
      function () {
        if (window.innerWidth > 860 && links.classList.contains("is-open")) {
          setMenuOpen(false);
        }
      },
      { passive: true }
    );

    // Escape closes menu
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && links.classList.contains("is-open")) {
        setMenuOpen(false);
      }
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length && "IntersectionObserver" in window) {
    var revObs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revObs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) {
      revObs.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ---------- Smooth anchor for hero CTA ---------- */
  document.querySelectorAll('[data-scroll]').forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      var sel = btn.getAttribute("data-scroll");
      var target = document.querySelector(sel);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  /* ---------- Active nav link ---------- */
  var path = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav__link").forEach(function (link) {
    var href = (link.getAttribute("href") || "").split("?")[0].split("#")[0];
    var file = href.split("/").pop();
    if (
      file === path ||
      (path === "" && file === "index.html") ||
      (path === "index.html" && (file === "index.html" || file === "" || href === "./" || href === "/")) ||
      (path === "watch.html" && file === "best-sellers.html")
    ) {
      if (path === "watch.html" && file === "best-sellers.html") {
        /* keep best-sellers inactive on watch detail unless desired */
      } else if (
        (path === "index.html" || path === "") &&
        (file === "index.html" || href === "index.html" || href === "./" || href === "/")
      ) {
        link.classList.add("is-active");
      } else if (file === path) {
        link.classList.add("is-active");
      }
    }
  });

  /* Fix active state more cleanly */
  document.querySelectorAll(".nav__link").forEach(function (link) {
    link.classList.remove("is-active");
    var href = (link.getAttribute("href") || "").split("?")[0];
    var file = href.split("/").pop() || "index.html";
    if (path === "watch.html") {
      if (file === "best-sellers.html") link.classList.add("is-active");
    } else if ((path === "" || path === "index.html") && (file === "index.html" || href === "index.html")) {
      link.classList.add("is-active");
    } else if (file === path) {
      link.classList.add("is-active");
    }
  });
})();
