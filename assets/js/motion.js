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
  // Use gsap.from() so every element finishes at its natural (visible) state —
  // even if a tween is interrupted, content is never left hidden.
  var heroReveals = gsap.utils.toArray(".hero [data-reveal]");
  var name = document.querySelector(".hero-name[data-split]");
  var intro = gsap.timeline({ defaults: { ease: ease } });

  var splitChars = null;
  if (name && window.SplitText) {
    try {
      gsap.registerPlugin(window.SplitText);
      var split = new window.SplitText(name, { type: "chars" });
      splitChars = split.chars && split.chars.length ? split.chars : null;
    } catch (e) {
      splitChars = null;
    }
  }

  if (splitChars) {
    intro.from(splitChars, { yPercent: 120, opacity: 0, stagger: 0.025, duration: 0.7 }, 0);
    var rest = heroReveals.filter(function (el) {
      return el !== name;
    });
    intro.from(rest, { opacity: 0, y: 22, stagger: 0.08, duration: 0.6 }, 0.2);
  } else {
    intro.from(heroReveals, { opacity: 0, y: 22, stagger: 0.08, duration: 0.6 }, 0);
  }

  // --- Inner-page hero intro -------------------------------------------------
  // Inner pages have a .page-hero header instead of the home .hero. Give its
  // [data-reveal] children the same quick staggered entrance on load.
  var pageHeroReveals = gsap.utils.toArray(".page-hero[data-reveal], .page-hero [data-reveal]");
  if (pageHeroReveals.length) {
    gsap.from(pageHeroReveals, {
      opacity: 0,
      y: 26,
      stagger: 0.1,
      duration: 0.7,
      ease: ease
    });
  }

  // --- Scroll-triggered reveals for the rest --------------------------------
  if (window.ScrollTrigger) {
    var ScrollTrigger = window.ScrollTrigger;

    // Reveal each section's items together with a stagger so moving from one
    // section to the next reads as a clear entrance.
    gsap.utils.toArray(".home-section, .hero ~ *").forEach(function (section) {
      var items = section.matches("[data-reveal]")
        ? [section]
        : gsap.utils.toArray("[data-reveal]", section);
      if (!items.length) return;
      gsap.set(items, { opacity: 0, y: 48 });
      gsap.to(items, {
        opacity: 1,
        y: 0,
        duration: 0.85,
        ease: ease,
        stagger: 0.12,
        scrollTrigger: { trigger: section, start: "top 82%", once: true }
      });
    });

    // Catch any stray [data-reveal] not inside a section.
    gsap.utils.toArray("[data-reveal]").forEach(function (el) {
      if (el.closest(".hero")) return;
      if (el.closest(".home-section")) return;
      if (el.closest(".page-hero") || el.matches(".page-hero")) return;
      gsap.set(el, { opacity: 0, y: 48 });
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.85,
        ease: ease,
        scrollTrigger: { trigger: el, start: "top 86%", once: true }
      });
    });

    // Gentle scroll parallax on the whole ambient layer (orbs keep their own
    // CSS drift; this just adds depth as you move between sections).
    var auroraBg = document.querySelector(".aurora-bg");
    if (auroraBg) {
      gsap.to(auroraBg, {
        y: 140,
        ease: "none",
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: 1
        }
      });
    }

    // Recalculate once everything (fonts, images) has settled.
    window.addEventListener("load", function () {
      ScrollTrigger.refresh();
    });
  } else {
    // No ScrollTrigger: just show the non-hero content.
    gsap.utils.toArray("[data-reveal]").forEach(function (el) {
      if (el.closest(".hero")) return;
      el.classList.add("is-revealed");
    });
  }
})();
