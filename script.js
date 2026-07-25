"use strict";

function qs(selector, root) {
  return (root || document).querySelector(selector);
}

function qsa(selector, root) {
  return Array.from((root || document).querySelectorAll(selector));
}

function setCurrentYear() {
  var el = qs("#year");
  if (el) el.textContent = String(new Date().getFullYear());
}

function initMobileMenu() {
  var toggle = qs("#navToggle");
  var links = qs("#navLinks");
  if (!toggle || !links) return;

  function closeMenu() {
    toggle.classList.remove("is-open");
    links.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }

  function openMenu() {
    toggle.classList.add("is-open");
    links.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
  }

  toggle.addEventListener("click", function () {
    links.classList.contains("is-open") ? closeMenu() : openMenu();
  });

  qsa("a", links).forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", function (e) {
    if (!toggle.contains(e.target) && !links.contains(e.target)) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });
}

function initFadeIn() {
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) return;

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  qsa(".fade-in").forEach(function (el) {
    observer.observe(el);
  });
}

function initActiveNav() {
  var sections = qsa("section[id], header[id]");
  var navLinks = qsa(".nav__links a");

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute("id");
          navLinks.forEach(function (link) {
            link.classList.remove("is-active");
            if (link.getAttribute("href") === "#" + id) {
              link.classList.add("is-active");
            }
          });
        }
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );

  sections.forEach(function (section) {
    observer.observe(section);
  });
}

function initRoamingCats() {
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) return;

  var cats = [
    { el: qs("#cat1"), x: 60, speed: 1.1, flipped: false },
    { el: qs("#cat2"), x: 200, speed: -0.8, flipped: true }
  ];

  function placeCat(cat) {
    cat.el.style.left = cat.x + "px";
    var svg = cat.el.querySelector("svg");
    if (svg) {
      svg.style.transform = cat.flipped ? "scaleX(-1)" : "scaleX(1)";
    }
  }

  var rafId = null;

  function tick() {
    var vw = window.innerWidth;
    var catW = cats[0].el.offsetWidth || 46;

    cats.forEach(function (cat) {
      cat.x += cat.speed;

      if (cat.x <= 0) {
        cat.x = 0;
        cat.speed = Math.abs(cat.speed);
        cat.flipped = false;
      } else if (cat.x + catW >= vw) {
        cat.x = vw - catW;
        cat.speed = -Math.abs(cat.speed);
        cat.flipped = true;
      }

      placeCat(cat);
    });

    rafId = requestAnimationFrame(tick);
  }

  if (cats.every(function (c) { return c.el; })) {
    cats.forEach(function (cat) { placeCat(cat); });
    rafId = requestAnimationFrame(tick);
  }

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      cancelAnimationFrame(rafId);
    } else {
      rafId = requestAnimationFrame(tick);
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  setCurrentYear();
  initMobileMenu();
  initFadeIn();
  initActiveNav();
  initRoamingCats();
});
