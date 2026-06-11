(function() {
  var activeModal = null;
  var previousFocus = null;
  var modalOverlay = null;
  var isNavigating = false;

  function initializeLucideIcons(root) {
    if (!window.lucide || typeof window.lucide.createIcons !== 'function') {
      return;
    }

    window.lucide.createIcons({
      root: root || document
    });
  }

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
      } else if (document.activeElement && nav.contains(document.activeElement)) {
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
    return (project.dataset.tags || '')
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

  function getCarouselSlides(carousel) {
    return Array.prototype.filter.call(carousel.children, function(child) {
      return child.classList.contains('carousel-item');
    });
  }

  function initializeCarousels(root) {
    var scope = root || document;

    scope.querySelectorAll('.carousel').forEach(function(carousel) {
      var slides = getCarouselSlides(carousel);
      var activeIndex = 0;

      if (!slides.length) {
        return;
      }

      function setSlide(index) {
        activeIndex = (index + slides.length) % slides.length;

        slides.forEach(function(slide, slideIndex) {
          var isActive = slideIndex === activeIndex;
          slide.classList.toggle('is-active', isActive);
          slide.setAttribute('aria-hidden', isActive ? 'false' : 'true');
        });

        var status = carousel.querySelector('[data-carousel-status]');
        if (status) {
          status.textContent = (activeIndex + 1) + ' / ' + slides.length;
        }
      }

      if (carousel.dataset.version3CarouselBound !== 'true') {
        carousel.dataset.version3CarouselBound = 'true';

        if (slides.length > 1) {
          var controls = document.createElement('div');
          var previous = document.createElement('button');
          var next = document.createElement('button');
          var status = document.createElement('span');

          controls.className = 'v3-carousel-controls';
          previous.className = 'v3-carousel-control v3-carousel-control-prev';
          next.className = 'v3-carousel-control v3-carousel-control-next';
          status.className = 'v3-carousel-status';
          status.setAttribute('data-carousel-status', '');
          status.setAttribute('aria-live', 'polite');

          previous.type = 'button';
          next.type = 'button';
          previous.setAttribute('aria-label', 'Previous image');
          next.setAttribute('aria-label', 'Next image');
          previous.innerHTML = '<i data-lucide="chevron-left" class="site-icon" aria-hidden="true"></i>';
          next.innerHTML = '<i data-lucide="chevron-right" class="site-icon" aria-hidden="true"></i>';

          previous.addEventListener('click', function(event) {
            event.preventDefault();
            setSlide(activeIndex - 1);
          });

          next.addEventListener('click', function(event) {
            event.preventDefault();
            setSlide(activeIndex + 1);
          });

          controls.appendChild(previous);
          controls.appendChild(status);
          controls.appendChild(next);
          carousel.appendChild(controls);
        }
      }

      setSlide(Number(carousel.dataset.activeSlide || 0));
      carousel.version3SetSlide = setSlide;
    });
  }

  function getFocusableElements(element) {
    return Array.prototype.slice.call(element.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )).filter(function(item) {
      return item.offsetParent !== null || item === document.activeElement;
    });
  }

  function ensureModalOverlay() {
    if (modalOverlay) {
      return modalOverlay;
    }

    modalOverlay = document.createElement('div');
    modalOverlay.className = 'v3-modal-overlay';
    modalOverlay.hidden = true;
    modalOverlay.addEventListener('click', closeModal);
    document.body.appendChild(modalOverlay);

    return modalOverlay;
  }

  function ensureModalCloseButton(modal) {
    if (modal.querySelector('.modal-close-button')) {
      return;
    }

    var closeButton = document.createElement('button');
    closeButton.className = 'modal-close modal-close-button';
    closeButton.type = 'button';
    closeButton.setAttribute('aria-label', 'Close dialog');
    closeButton.innerHTML = '<i data-lucide="x" class="site-icon" aria-hidden="true"></i>';
    modal.insertBefore(closeButton, modal.firstChild);
  }

  function openModal(modal) {
    if (!modal) {
      return;
    }

    if (activeModal && activeModal !== modal) {
      closeModal();
    }

    previousFocus = document.activeElement;
    activeModal = modal;
    ensureModalCloseButton(modal);
    initializeCarousels(modal);

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    modal.setAttribute('aria-modal', 'true');
    if (!modal.getAttribute('role')) {
      modal.setAttribute('role', 'dialog');
    }

    ensureModalOverlay().hidden = false;
    document.body.classList.add('modal-open');

    var focusable = getFocusableElements(modal);
    var firstFocusable = focusable[0] || modal;
    if (!modal.hasAttribute('tabindex')) {
      modal.setAttribute('tabindex', '-1');
    }
    firstFocusable.focus();
  }

  function closeModal() {
    if (!activeModal) {
      return;
    }

    activeModal.classList.remove('is-open');
    activeModal.setAttribute('aria-hidden', 'true');
    activeModal = null;

    if (modalOverlay) {
      modalOverlay.hidden = true;
    }

    document.body.classList.remove('modal-open');

    if (previousFocus && document.contains(previousFocus)) {
      previousFocus.focus();
    }
    previousFocus = null;
  }

  function getNextProjectModal(currentModal) {
    var modals = Array.prototype.slice.call(document.querySelectorAll('.project_list .modal'));
    var currentIndex = modals.indexOf(currentModal);

    if (!modals.length) {
      return null;
    }

    if (currentIndex === -1 || currentIndex === modals.length - 1) {
      return modals[0];
    }

    return modals[currentIndex + 1];
  }

  function initializeModals() {
    document.querySelectorAll('.modal').forEach(function(modal) {
      modal.setAttribute('aria-hidden', modal.classList.contains('is-open') ? 'false' : 'true');
      ensureModalCloseButton(modal);
    });

    initializeCarousels(document);

    if (document.documentElement.dataset.version3ModalBound === 'true') {
      return;
    }

    document.documentElement.dataset.version3ModalBound = 'true';

    document.addEventListener('click', function(event) {
      var closeTarget = event.target.closest('.modal-close');
      var nextProjectTarget = event.target.closest('.project_list .next');
      var modalTrigger = event.target.closest('.modal-trigger');

      if (nextProjectTarget) {
        event.preventDefault();
        openModal(getNextProjectModal(activeModal));
        return;
      }

      if (closeTarget) {
        event.preventDefault();
        closeModal();
        return;
      }

      if (modalTrigger) {
        var rawHref = modalTrigger.getAttribute('href') || '';
        var modalId = rawHref.charAt(0) === '#' ? rawHref.slice(1) : '';
        var modal = modalId ? document.getElementById(modalId) : null;

        if (modal) {
          event.preventDefault();
          openModal(modal);
        }
      }
    });
  }

  function openContactSuccessModal() {
    openModal(document.getElementById('email_modal'));
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

  function initializeAutoResizeTextareas() {
    document.querySelectorAll('textarea').forEach(function(textarea) {
      if (textarea.dataset.version3ResizeBound === 'true') {
        return;
      }

      function resize() {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
      }

      textarea.dataset.version3ResizeBound = 'true';
      textarea.addEventListener('input', resize);
      resize();
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

    scrollButton.style.display = scrollRatio > 0.1 ? 'inline-flex' : 'none';
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

  function isTransitionableLink(link, event) {
    var rawHref = link.getAttribute('href') || '';

    if (
      isNavigating ||
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      !rawHref.trim() ||
      rawHref.charAt(0) === '#' ||
      link.classList.contains('modal-trigger') ||
      link.classList.contains('modal-close') ||
      link.hasAttribute('download') ||
      link.dataset.noTransition === 'true'
    ) {
      return false;
    }

    if (link.target && link.target !== '_self') {
      return false;
    }

    var url;
    try {
      url = new URL(rawHref, window.location.href);
    } catch (error) {
      return false;
    }

    if (url.origin !== window.location.origin) {
      return false;
    }

    if (
      url.pathname === window.location.pathname &&
      url.search === window.location.search &&
      url.hash
    ) {
      return false;
    }

    return true;
  }

  function initializePageTransitions() {
    document.documentElement.classList.add('v3-page-ready');

    if (document.documentElement.dataset.version3TransitionsBound === 'true') {
      return;
    }

    document.documentElement.dataset.version3TransitionsBound = 'true';

    window.addEventListener('pageshow', function() {
      isNavigating = false;
      document.documentElement.classList.remove('v3-page-leaving');
      document.documentElement.classList.add('v3-page-ready');
    });

    document.addEventListener('click', function(event) {
      var link = event.target.closest('a');

      if (!link || !isTransitionableLink(link, event)) {
        return;
      }

      event.preventDefault();
      isNavigating = true;
      closeCurrentMobileNav();
      closeModal();
      document.documentElement.classList.add('v3-page-leaving');

      window.setTimeout(function() {
        window.location.href = link.href;
      }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 140);
    });
  }

  function initializeGlobalEvents() {
    if (document.documentElement.dataset.version3GlobalEvents === 'true') {
      return;
    }

    document.documentElement.dataset.version3GlobalEvents = 'true';
    document.addEventListener('keydown', function(event) {
      var focusable;
      var firstFocusable;
      var lastFocusable;
      var toggle = document.querySelector('[data-mobile-nav-toggle]');

      if (event.key === 'Escape') {
        if (activeModal) {
          event.preventDefault();
          closeModal();
          return;
        }

        if (toggle && toggle.getAttribute('aria-expanded') === 'true') {
          closeCurrentMobileNav();
          toggle.focus();
        }
      }

      if (event.key === 'Tab' && activeModal) {
        focusable = getFocusableElements(activeModal);

        if (!focusable.length) {
          event.preventDefault();
          activeModal.focus();
          return;
        }

        firstFocusable = focusable[0];
        lastFocusable = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === firstFocusable) {
          event.preventDefault();
          lastFocusable.focus();
        } else if (!event.shiftKey && document.activeElement === lastFocusable) {
          event.preventDefault();
          firstFocusable.focus();
        }
      }
    });
  }

  function initializeVersion3Scripts() {
    initializeGlobalEvents();
    initializePageTransitions();
    initializeThemeToggles();
    initializeMobileNavigation();
    initializeProjectFilters();
    initializeModals();
    initializeContactForm();
    initializeAutoResizeTextareas();
    initializeNavigationState();
    initializeScrollTopControl();
    initializeLucideIcons(document);

    document.dispatchEvent(new Event('version3:page-ready'));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeVersion3Scripts);
  } else {
    initializeVersion3Scripts();
  }
})();
