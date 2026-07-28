/**
 * Unique watch assembly animations per product card
 */
(function () {
  "use strict";

  var PART_SETS = {
    cascade: ["strap", "case", "dial", "bezel", "hands"],
    orbit: ["case", "bezel", "dial", "hands", "buttons"],
    stack: ["strap", "case", "dial", "bezel", "crown"],
    fan: ["strap", "case", "dial", "bezel", "hands"],
    pulse: ["case", "markers", "dial", "bezel", "hands"],
    slide: ["strap", "case", "dial", "bezel", "hands"],
  };

  var DELAYS = {
    cascade: [0, 180, 360, 540, 720],
    orbit: [0, 200, 400, 600, 800],
    stack: [0, 160, 320, 480, 640],
    fan: [0, 150, 300, 500, 700],
    pulse: [0, 220, 400, 580, 760],
    slide: [0, 200, 400, 600, 800],
  };

  function partClass(name) {
    var map = {
      case: "part-shape part-shape--rect",
      dial: "part-shape part-shape--dial",
      hands: "part-shape part-shape--hands",
      strap: "part-shape part-shape--strap",
      buttons: "part-shape part-shape--buttons",
      crown: "part-shape part-shape--crown",
      bezel: "",
      markers: "",
    };
    return map[name] || "part-shape";
  }

  function buildAssembly(type) {
    var parts = PART_SETS[type] || PART_SETS.cascade;
    var root = document.createElement("div");
    root.className = "assembly assembly--" + type;
    root.setAttribute("aria-hidden", "true");

    parts.forEach(function (name) {
      var el = document.createElement("div");
      el.className = "assembly__part p-" + name;
      el.dataset.part = name;
      if (name !== "bezel" && name !== "markers") {
        var shape = document.createElement("div");
        shape.className = partClass(name);
        el.appendChild(shape);
      }
      root.appendChild(el);
    });

    return root;
  }

  function runAssembly(card) {
    if (card.dataset.assembled === "1") return;
    card.dataset.assembled = "1";

    var type = card.dataset.assembly || "cascade";
    var parts = card.querySelectorAll(".assembly__part");
    var delays = DELAYS[type] || DELAYS.cascade;

    parts.forEach(function (part, i) {
      setTimeout(function () {
        part.classList.add("is-in");
      }, delays[i] || i * 180);
    });

    var total = (delays[delays.length - 1] || 800) + 700;
    setTimeout(function () {
      card.classList.add("is-assembled");
    }, total);
  }

  function initCards() {
    var grid = document.querySelector("[data-products]");
    if (!grid || !window.CASIO_PRODUCTS) return;

    window.CASIO_PRODUCTS.forEach(function (product) {
      var card = document.createElement("article");
      card.className = "product-card glass reveal";
      card.dataset.assembly = product.assembly;
      card.dataset.id = product.id;

      var stage = document.createElement("div");
      stage.className = "product-card__stage";

      var assembly = buildAssembly(product.assembly);
      stage.appendChild(assembly);

      var img = document.createElement("img");
      img.className = "product-card__photo";
      img.src = product.image;
      img.alt = product.name;
      img.loading = "lazy";
      stage.appendChild(img);

      var body = document.createElement("div");
      body.className = "product-card__body";
      body.innerHTML =
        "<h3 class=\"product-card__name\">" +
        product.name +
        "</h3>" +
        "<p class=\"product-card__price\">" +
        product.price +
        "</p>" +
        "<div class=\"product-card__actions\">" +
        "<a class=\"btn btn--ghost\" href=\"watch.html?id=" +
        product.id +
        "\">Подробнее <svg class=\"btn__arrow\" viewBox=\"0 0 16 16\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\"><path d=\"M3 8h10M9 4l4 4-4 4\"/></svg></a>" +
        "</div>";

      card.appendChild(stage);
      card.appendChild(body);
      grid.appendChild(card);
    });

    // Re-bind reveal for dynamically added cards
    var cards = grid.querySelectorAll(".product-card");
    if ("IntersectionObserver" in window) {
      var obs = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              runAssembly(entry.target);
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.25, rootMargin: "0px 0px -30px 0px" }
      );
      cards.forEach(function (c) {
        obs.observe(c);
      });
    } else {
      cards.forEach(function (c) {
        c.classList.add("is-visible");
        runAssembly(c);
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCards);
  } else {
    initCards();
  }
})();
