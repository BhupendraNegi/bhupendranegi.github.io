/*
 * Aurora motion layer (GSAP). Uses native browser scrolling.
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

  // Built-in expo.out is visually ~identical to the old custom
  // cubic-bezier(0.16, 1, 0.3, 1), so we use it instead of loading the
  // CustomEase plugin (one fewer external script).
  var ease = "expo.out";

  // --- Anchor links (native scroll) ------------------------------------------
  // Native browser scrolling is used (no smooth-scroll library) — it felt best
  // and matches the original site. In-page anchor links get a gentle native
  // smooth scroll, skipping modal triggers which own their own clicks.
  document.addEventListener("click", function (event) {
    var link = event.target.closest('a[href^="#"]');
    if (!link) return;
    if (link.classList.contains("modal-trigger")) return;
    var id = link.getAttribute("href");
    if (id.length < 2) return;
    // getElementById avoids invalid-selector errors for numeric ids (#1).
    var target = document.getElementById(id.slice(1));
    if (!target) return;
    event.preventDefault();
    var top = target.getBoundingClientRect().top + window.pageYOffset - 80;
    window.scrollTo({ top: top, behavior: "smooth" });
  });

  // --- Intro animations ------------------------------------------------------
  // Use gsap.from() so every element finishes at its natural (visible) state —
  // even if a tween is interrupted, content is never left hidden.
  if (window.SplitText) {
    try {
      gsap.registerPlugin(window.SplitText);
    } catch (e) {}
  }

  // Split a heading into characters; returns the char array, or null.
  // "words,chars" keeps each word in an inline-block wrapper so lines never
  // break mid-word, while still animating individual characters.
  function splitChars(el) {
    if (!el || !window.SplitText) return null;
    try {
      var s = new window.SplitText(el, { type: "words,chars" });
      return s.chars && s.chars.length ? s.chars : null;
    } catch (e) {
      return null;
    }
  }

  // Home hero: split the name, stagger the rest.
  var hero = document.querySelector(".hero");
  if (hero) {
    var heroReveals = gsap.utils.toArray(".hero [data-reveal]");
    var heroName = hero.querySelector(".hero-name[data-split]");
    var heroChars = splitChars(heroName);
    var intro = gsap.timeline({ defaults: { ease: ease } });
    if (heroChars) {
      intro.from(heroChars, { yPercent: 120, opacity: 0, stagger: 0.025, duration: 0.7 }, 0);
      intro.from(
        heroReveals.filter(function (el) { return el !== heroName; }),
        { opacity: 0, y: 22, stagger: 0.08, duration: 0.6 },
        0.2
      );
    } else {
      intro.from(heroReveals, { opacity: 0, y: 22, stagger: 0.08, duration: 0.6 }, 0);
    }
  }

  // Inner pages: the .page-hero / .post-hero header gets the SAME treatment —
  // split the title into characters, with whatever sits before it (eyebrow,
  // back link) and after it (lead, meta) easing in around the characters.
  var innerHero = document.querySelector(".page-hero, .post-hero");
  if (innerHero) {
    var ihTitle = innerHero.querySelector(".page-hero-title, .post-hero-title");
    var ihChars = splitChars(ihTitle);
    var before = [];
    var after = [];
    var seenTitle = false;
    Array.prototype.forEach.call(innerHero.children, function (child) {
      if (child === ihTitle) { seenTitle = true; return; }
      (seenTitle ? after : before).push(child);
    });
    var ihIntro = gsap.timeline({ defaults: { ease: ease } });
    if (ihChars) {
      if (before.length) ihIntro.from(before, { opacity: 0, y: 18, stagger: 0.08, duration: 0.5 }, 0);
      ihIntro.from(ihChars, { yPercent: 120, opacity: 0, stagger: 0.025, duration: 0.7 }, 0.1);
      if (after.length) ihIntro.from(after, { opacity: 0, y: 18, stagger: 0.08, duration: 0.6 }, 0.4);
    } else {
      ihIntro.from(
        Array.prototype.slice.call(innerHero.children),
        { opacity: 0, y: 22, stagger: 0.1, duration: 0.7 },
        0
      );
    }
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
