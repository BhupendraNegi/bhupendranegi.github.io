(function() {
  function getStoredTheme() {
    try {
      return localStorage.getItem('theme');
    } catch (error) {
      return null;
    }
  }

  function storeTheme(theme) {
    try {
      localStorage.setItem('theme', theme);
    } catch (error) {
      return;
    }
  }

  function getCurrentTheme() {
    return document.documentElement.getAttribute('data-theme') || getStoredTheme() || 'light';
  }

  function applyTheme(theme) {
    var normalizedTheme = theme === 'dark' ? 'dark' : 'light';
    var isDark = normalizedTheme === 'dark';

    document.documentElement.setAttribute('data-theme', normalizedTheme);

    document.querySelectorAll('[data-theme-toggle]').forEach(function(toggle) {
      toggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
      toggle.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
    });
  }

  function initializeThemeToggles() {
    applyTheme(getCurrentTheme());

    document.querySelectorAll('[data-theme-toggle]').forEach(function(toggle) {
      if (toggle.dataset.version3ThemeBound === 'true') {
        return;
      }

      toggle.dataset.version3ThemeBound = 'true';
      toggle.addEventListener('click', function(event) {
        event.preventDefault();

        var nextTheme = getCurrentTheme() === 'dark' ? 'light' : 'dark';
        storeTheme(nextTheme);
        applyTheme(nextTheme);
      });
    });
  }

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

  function getProjectTags(project) {
    return (project.getAttribute('tags') || '')
      .split(',')
      .map(function(tag) {
        return tag.trim();
      })
      .filter(Boolean);
  }

  function initializeProjectFilters() {
    var toggle = document.querySelector('[data-project-filter-toggle]');
    var tagsContainer = document.getElementById('tags');
    var tagButtons = document.querySelectorAll('[data-project-tag]');
    var clearButton = document.querySelector('[data-project-clear-filters]');
    var projects = document.querySelectorAll('.project');

    if (!toggle || !tagsContainer || !tagButtons.length || !projects.length) {
      return;
    }

    function setFilterListOpen(open) {
      tagsContainer.hidden = !open;
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.textContent = open ? 'Hide filters' : 'Filter by Technology';
    }

    function getActiveTags() {
      return Array.prototype.slice.call(tagButtons)
        .filter(function(button) {
          return button.getAttribute('aria-pressed') === 'true';
        })
        .map(function(button) {
          return button.dataset.projectTag;
        });
    }

    function updateProjects() {
      var activeTags = getActiveTags();

      projects.forEach(function(project) {
        var projectTags = getProjectTags(project);
        var shouldShow = activeTags.length === 0 || activeTags.some(function(tag) {
          return projectTags.indexOf(tag) !== -1;
        });

        project.hidden = !shouldShow;
      });
    }

    function clearFilters() {
      tagButtons.forEach(function(button) {
        button.classList.remove('active_tag');
        button.setAttribute('aria-pressed', 'false');
      });
      updateProjects();
    }

    setFilterListOpen(toggle.getAttribute('aria-expanded') === 'true');
    updateProjects();

    if (toggle.dataset.version3FilterBound !== 'true') {
      toggle.dataset.version3FilterBound = 'true';
      toggle.addEventListener('click', function(event) {
        event.preventDefault();
        setFilterListOpen(toggle.getAttribute('aria-expanded') !== 'true');
      });
    }

    tagButtons.forEach(function(button) {
      if (button.dataset.version3FilterBound === 'true') {
        return;
      }

      button.dataset.version3FilterBound = 'true';
      button.addEventListener('click', function(event) {
        event.preventDefault();

        var isActive = button.getAttribute('aria-pressed') === 'true';
        button.classList.toggle('active_tag', !isActive);
        button.setAttribute('aria-pressed', isActive ? 'false' : 'true');
        updateProjects();
      });
    });

    if (clearButton && clearButton.dataset.version3FilterBound !== 'true') {
      clearButton.dataset.version3FilterBound = 'true';
      clearButton.addEventListener('click', function(event) {
        event.preventDefault();
        clearFilters();
      });
    }
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
    initializeThemeToggles();
    initializeMobileNavigation();
    initializeProjectFilters();
  }

  document.addEventListener('DOMContentLoaded', initializeVersion3Scripts);
  document.addEventListener('transitionCompleted', initializeVersion3Scripts);
})();
