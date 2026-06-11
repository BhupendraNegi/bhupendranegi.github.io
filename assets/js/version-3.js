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

  function openContactSuccessModal() {
    var modal = document.getElementById('email_modal');

    if (!modal) {
      return;
    }

    if (window.jQuery && window.jQuery.fn && window.jQuery.fn.modal) {
      window.jQuery(modal).modal('open');
      return;
    }

    modal.style.display = 'block';
    modal.classList.add('open');
  }

  function initializeContactForm() {
    var form = document.querySelector('[data-contact-form]');

    if (!form || form.dataset.version3ContactBound === 'true') {
      return;
    }

    var submitButton = form.querySelector('[data-contact-submit]');
    var status = form.querySelector('[data-contact-status]');

    function setStatus(message, isError) {
      if (!status) {
        return;
      }

      status.textContent = message;
      status.classList.toggle('contact-status-error', Boolean(isError));
    }

    function setSubmitting(isSubmitting) {
      if (!submitButton) {
        return;
      }

      submitButton.disabled = isSubmitting;
      submitButton.textContent = isSubmitting ? 'Sending...' : 'Submit';
    }

    form.dataset.version3ContactBound = 'true';
    form.addEventListener('submit', function(event) {
      event.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      setSubmitting(true);
      setStatus('Sending your message...', false);

      fetch(form.action, {
        method: form.method || 'POST',
        body: new FormData(form),
        headers: {
          Accept: 'application/json'
        }
      }).then(function(response) {
        if (!response.ok) {
          throw new Error('Contact form submission failed.');
        }

        form.reset();
        form.querySelectorAll('.email_input').forEach(function(input) {
          input.classList.remove('valid', 'invalid');
        });
        setStatus('', false);
        openContactSuccessModal();
      }).catch(function() {
        setStatus('Something went wrong. Please try again or email me directly.', true);
      }).finally(function() {
        setSubmitting(false);
      });
    });
  }

  function normalizePath(path) {
    var normalizedPath = (path || '/').split('?')[0].replace(/\/+$/, '');
    return normalizedPath || '/';
  }

  function initializeNavigationState() {
    var currentPath = normalizePath(window.location.pathname);

    document.querySelectorAll('nav .nav-underline').forEach(function(underline) {
      underline.classList.remove('nav-underlined');
    });

    document.querySelectorAll('nav ul li a').forEach(function(link) {
      var linkPath = normalizePath(link.getAttribute('href'));
      var underline = link.parentElement ? link.parentElement.querySelector('.nav-underline') : null;
      var isActive = linkPath !== '/' && (currentPath === linkPath || currentPath.indexOf(linkPath + '/') === 0);

      if (underline && isActive) {
        underline.classList.add('nav-underlined');
      }

      if (!underline || link.dataset.version3NavHoverBound === 'true') {
        return;
      }

      link.dataset.version3NavHoverBound = 'true';
      link.addEventListener('mouseenter', function() {
        underline.classList.add('nav-hover-underlined');
      });
      link.addEventListener('mouseleave', function() {
        underline.classList.remove('nav-hover-underlined');
      });
    });
  }

  function syncScrollTopVisibility() {
    var scrollButton = document.getElementById('scroll-top');

    if (!scrollButton) {
      return;
    }

    var documentHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight
    );
    var scrollRatio = documentHeight > 0 ? window.pageYOffset / documentHeight : 0;

    scrollButton.style.display = scrollRatio > 0.1 ? 'block' : 'none';
  }

  function initializeScrollTopControl() {
    var scrollButton = document.getElementById('scroll-top');

    if (document.documentElement.dataset.version3ScrollBound !== 'true') {
      document.documentElement.dataset.version3ScrollBound = 'true';
      window.addEventListener('scroll', syncScrollTopVisibility, { passive: true });
    }

    if (!scrollButton) {
      return;
    }

    syncScrollTopVisibility();

    if (scrollButton.dataset.version3ScrollBound === 'true') {
      return;
    }

    scrollButton.dataset.version3ScrollBound = 'true';
    scrollButton.addEventListener('click', function(event) {
      event.preventDefault();

      var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
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
    initializeThemeToggles();
    initializeMobileNavigation();
    initializeProjectFilters();
    initializeContactForm();
    initializeNavigationState();
    initializeScrollTopControl();
  }

  document.addEventListener('DOMContentLoaded', initializeVersion3Scripts);
  document.addEventListener('transitionCompleted', initializeVersion3Scripts);
})();
