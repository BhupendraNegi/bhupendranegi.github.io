(function() {
  function closeCurrentMobileNav() {
    var toggle = document.querySelector('[data-mobile-nav-toggle]');
    var nav = document.getElementById('mobile-demo');
    var backdrop = document.querySelector('.mobile-nav-backdrop');

    if (!toggle || !nav) {
      return;
    }

    document.body.classList.remove('mobile-nav-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation menu');
    nav.setAttribute('aria-hidden', 'true');

    if (backdrop) {
      backdrop.hidden = true;
    }
  }

  function initializeMobileNavigation() {
    var toggle = document.querySelector('[data-mobile-nav-toggle]');
    var nav = document.getElementById('mobile-demo');
    var closeTargets = document.querySelectorAll('[data-mobile-nav-close]');

    if (!toggle || !nav || toggle.dataset.version3Bound === 'true') {
      return;
    }

    function setOpen(open) {
      document.body.classList.toggle('mobile-nav-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
      nav.setAttribute('aria-hidden', open ? 'false' : 'true');

      closeTargets.forEach(function(target) {
        if (target.classList.contains('mobile-nav-backdrop')) {
          target.hidden = !open;
        }
      });

      if (open) {
        var firstLink = nav.querySelector('a, button');
        if (firstLink) {
          firstLink.focus();
        }
      } else {
        toggle.focus();
      }
    }

    closeCurrentMobileNav();
    toggle.dataset.version3Bound = 'true';

    toggle.addEventListener('click', function(event) {
      event.preventDefault();
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    closeTargets.forEach(function(target) {
      target.addEventListener('click', function() {
        setOpen(false);
      });
    });

    nav.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        setOpen(false);
      });
    });
  }

  function initializeGlobalEvents() {
    if (document.documentElement.dataset.version3GlobalEvents === 'true') {
      return;
    }

    document.documentElement.dataset.version3GlobalEvents = 'true';
    document.addEventListener('keydown', function(event) {
      var toggle = document.querySelector('[data-mobile-nav-toggle]');
      if (event.key === 'Escape' && toggle && toggle.getAttribute('aria-expanded') === 'true') {
        closeCurrentMobileNav();
        toggle.focus();
      }
    });
  }

  function initializeVersion3Scripts() {
    initializeGlobalEvents();
    initializeMobileNavigation();
  }

  document.addEventListener('DOMContentLoaded', initializeVersion3Scripts);
  document.addEventListener('transitionCompleted', initializeVersion3Scripts);
})();
