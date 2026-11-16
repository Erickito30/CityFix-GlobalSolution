"use strict";

// Comportamento compartilhado pelas páginas do CityFix.
document.querySelectorAll("[data-current-year]").forEach((element) => {
  element.textContent = String(new Date().getFullYear());
});
