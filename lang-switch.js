/* Neraca — interaksi website statis: navigasi mobile + preferensi bahasa */
(function () {
  "use strict";

  /* 1) Toggle navigasi mobile */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* 2) Ingat pilihan bahasa (localStorage) agar versi yang dibuka
        kali berikutnya konsisten dengan preferensi terakhir. */
  var LANG_KEY = "neraca_lang";
  try {
    var stored = localStorage.getItem(LANG_KEY);
    var htmlLang = (document.documentElement.lang || "id").slice(0, 2);
    if (stored && stored !== htmlLang) {
      /* Catat bahwa pengguna memilih berbeda dari halaman ini hanya
         saat menekan tombol bahasa (ditangani di bawah). */
    }
    document.querySelectorAll("[data-lang-set]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        try {
          localStorage.setItem(LANG_KEY, btn.getAttribute("data-lang-set"));
        } catch (e) { /* storage penuh/di-block — abaikan */ }
      });
    });
  } catch (e) { /* localStorage tidak tersedia — abaikan */ }
})();
