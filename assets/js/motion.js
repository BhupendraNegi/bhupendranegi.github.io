/*
 * Aurora motion layer (GSAP + Lenis).
 * Progressive enhancement: if GSAP is unavailable or the user prefers reduced
 * motion, all [data-reveal] content is shown immediately and version-3.js is
 * told not to run its IntersectionObserver fallback.
 */
(function () {
  "use strict";

  var root = document.documentElement;
  var prefersReduced =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function revealAll() {
    var nodes = document.querySelectorAll("[data-reveal]");
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].classList.add("is-revealed");
    }
  }

  // Claim ownership of reveals so version-3.js skips its IO fallback.
  window.__auroraMotion = true;

  var gsap = window.gsap;

  if (prefersReduced || !gsap) {
    revealAll();
    return;
  }

  // GSAP owns animation now: drop the CSS hide/transition layer and let GSAP
  // drive opacity/transform with inline styles (no double transitions).
  root.classList.remove("reveals");

  if (window.ScrollTrigger) {
    gsap.registerPlugin(window.ScrollTrigger);
  }

  var ease = "power3.out";
  if (window.CustomEase) {
    gsap.registerPlugin(window.CustomEase);
    window.CustomEase.create("aurora", "0.16, 1, 0.3, 1");
    ease = "aurora";
  }

  // --- Lenis smooth scroll ---------------------------------------------------
  var lenis = null;
  if (window.Lenis) {
    lenis = new window.Lenis({ duration: 1.05, smoothWheel: true });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    if (window.ScrollTrigger) {
      lenis.on("scroll", window.ScrollTrigger.update);
    }
    // Route same-page anchor links through Lenis for smooth jumps.
    document.addEventListener("click", function (event) {
      var link = event.target.closest('a[href^="#"]');
      if (!link) return;
      var id = link.getAttribute("href");
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target, { offset: -80 });
    });
  }

  // --- Hero intro ------------------------------------------------------------
  var heroReveals = gsap.utils.toArray(".hero [data-reveal]");
  var name = document.querySelector(".hero-name[data-split]");
  var intro = gsap.timeline({ defaults: { ease: ease } });

  if (heroReveals.length) {
    gsap.set(heroReveals, { opacity: 0, y: 22 });
  }

  var splitChars = null;
  if (name && window.SplitText) {
    try {
      var split = new window.SplitText(name, { type: "chars" });
      splitChars = split.chars;
    } catch (e) {
      splitChars = null;
    }
  }

  if (splitChars) {
    gsap.set(name, { opacity: 1, y: 0 });
    intro.from(
      splitChars,
      { yPercent: 120, opacity: 0, stagger: 0.025, duration: 0.7 },
      0
    );
    var nonName = heroReveals.filter(function (el) {
      return el !== name;
    });
    intro.to(nonName, { opacity: 1, y: 0, stagger: 0.08, duration: 0.6 }, 0.25);
  } else {
    intro.to(heroReveals, { opacity: 1, y: 0, stagger: 0.08, duration: 0.6 }, 0);
  }

  // --- Scroll-triggered reveals for the rest --------------------------------
  if (window.ScrollTrigger) {
    gsap.utils.toArray("[data-reveal]").forEach(function (el) {
      if (el.closest(".hero")) return;
      gsap.set(el, { opacity: 0, y: 28 });
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: ease,
        scrollTrigger: { trigger: el, start: "top 86%", once: true }
      });
    });
  } else {
    // No ScrollTrigger: just show the non-hero content.
    gsap.utils.toArray("[data-reveal]").forEach(function (el) {
      if (el.closest(".hero")) return;
      el.classList.add("is-revealed");
    });
  }
})();
