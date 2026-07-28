/**
 * Model detail page renderer
 */
(function () {
  "use strict";

  function qs(name) {
    var params = new URLSearchParams(window.location.search);
    return params.get(name);
  }

  function render() {
    if (!window.getProductById) return;

    var id = qs("id") || "ga-2100";
    var product = window.getProductById(id);

    var nameEl = document.querySelector("[data-watch-name]");
    var priceEl = document.querySelector("[data-watch-price]");
    var descEl = document.querySelector("[data-watch-desc]");
    var tagEl = document.querySelector("[data-watch-tag]");
    var imgEl = document.querySelector("[data-watch-image]");
    var specsEl = document.querySelector("[data-watch-specs]");

    if (nameEl) nameEl.textContent = product.name;
    if (priceEl) priceEl.textContent = product.price;
    if (descEl) descEl.textContent = product.description;
    if (tagEl) tagEl.textContent = product.tagline;
    if (imgEl) {
      imgEl.src = product.image;
      imgEl.alt = product.name;
    }

    document.title = product.name + " — Casio";

    if (specsEl && product.specs) {
      specsEl.innerHTML = "";
      Object.keys(product.specs).forEach(function (key) {
        var row = document.createElement("div");
        row.className = "watch-specs__row";
        row.innerHTML =
          "<dt>" + key + "</dt><dd>" + product.specs[key] + "</dd>";
        specsEl.appendChild(row);
      });
    }

  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", render);
  } else {
    render();
  }
})();
