(function() {
  var activeModal = null;
  var previousFocus = null;
  var modalOverlay = null;
  // Project modals in document order, captured before any get portalled to
  // <body> on open (so the "Next" button can still cycle through them).
  var projectModals = [];
  // Site search overlay handles, assigned by initializeSearch() so the global
  // keyboard shortcuts (Cmd/Ctrl+K, "/", Escape) can drive it.
  var openSiteSearch = null;
  var closeSiteSearch = null;
  var siteSearchOpen = false;

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
    } catch {
      return null;
    }
  }

  function storeTheme(theme) {
    try {
      localStorage.setItem('theme', theme);
    } catch {
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

    // Portal the modal up to <body>. The page content lives in a flex child
    // of <body> (.site-shell), so a body-level overlay would otherwise paint
    // over the modal no matter its z-index. As a direct child of <body> the
    // modal shares the overlay's stacking context and sits above it.
    ensureModalOverlay();
    if (modal.parentElement !== document.body) {
      document.body.appendChild(modal);
    }

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
    var modals = projectModals.length
      ? projectModals
      : Array.prototype.slice.call(document.querySelectorAll('.project_list .modal'));
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
    // Capture project modals in document order before any are portalled.
    if (!projectModals.length) {
      projectModals = Array.prototype.slice.call(document.querySelectorAll('.project_list .modal'));
    }

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
      var nextProjectTarget = event.target.closest('.modal .next');
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
        var rawHref = modalTrigger.getAttribute('data-modal-target') || modalTrigger.getAttribute('href') || '';
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
      submitButton.textContent = isSubmitting ? 'Sending…' : 'Send message';
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

  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function initializeScrollReveals(root) {
    // The GSAP motion layer (motion.js) owns reveals when present.
    if (window.__auroraMotion) {
      return;
    }

    var scope = root || document;
    var elements = scope.querySelectorAll('[data-reveal]:not(.is-revealed)');

    if (!elements.length) {
      return;
    }

    if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
      elements.forEach(function(element) {
        element.classList.add('is-revealed');
      });
      return;
    }

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

    elements.forEach(function(element) {
      observer.observe(element);
    });
  }

  function initializePageTransitions() {
    document.documentElement.classList.add('v3-page-ready');

    if (document.documentElement.dataset.version3TransitionsBound === 'true') {
      return;
    }

    document.documentElement.dataset.version3TransitionsBound = 'true';

    window.addEventListener('pageshow', function() {
      document.documentElement.classList.remove('v3-page-leaving', 'is-leaving');
      document.documentElement.classList.add('v3-page-ready');
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
      var target = event.target;
      var typing = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);

      // Cmd/Ctrl+K opens search from anywhere; "/" opens it unless already typing.
      if ((event.key === 'k' || event.key === 'K') && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        if (openSiteSearch) { openSiteSearch(); }
        return;
      }

      if (event.key === '/' && !typing && !siteSearchOpen) {
        event.preventDefault();
        if (openSiteSearch) { openSiteSearch(); }
        return;
      }

      if (event.key === 'Escape') {
        if (siteSearchOpen) {
          event.preventDefault();
          if (closeSiteSearch) { closeSiteSearch(); }
          return;
        }

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

  // ----- Single blog post enhancements: TOC, scroll-spy, copy buttons, progress

  function slugify(text) {
    return String(text)
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-') || 'section';
  }

  function buildPostTableOfContents(content) {
    var nav = document.querySelector('[data-post-toc]');
    var list = document.querySelector('[data-post-toc-list]');

    if (!nav || !list) {
      return [];
    }

    // Pages can narrow which heading levels appear in the summary via
    // `data-post-toc-levels` on the nav (e.g. "h2" for a top-level-only index).
    var levels = nav.getAttribute('data-post-toc-levels') || 'h2, h3, h4, h5, h6';

    var headings = Array.prototype.slice.call(
      content.querySelectorAll(levels)
    ).filter(function(heading) {
      return (heading.textContent || '').trim().length > 0;
    });

    if (headings.length < 2) {
      return [];
    }

    var minLevel = headings.reduce(function(min, heading) {
      var level = parseInt(heading.tagName.charAt(1), 10);
      return level < min ? level : min;
    }, 6);

    var usedIds = {};
    var entries = [];

    headings.forEach(function(heading) {
      var id = heading.id;

      if (!id) {
        id = slugify(heading.textContent);
      }

      if (usedIds[id]) {
        usedIds[id] += 1;
        id = id + '-' + usedIds[id];
      } else {
        usedIds[id] = 1;
      }

      heading.id = id;

      var level = parseInt(heading.tagName.charAt(1), 10);
      var item = document.createElement('li');
      var link = document.createElement('a');

      link.className = 'post-toc-link ' + (level === minLevel ? 'is-lvl-1' : 'is-lvl-2');
      link.href = '#' + id;
      link.textContent = (heading.textContent || '').trim();
      item.appendChild(link);
      list.appendChild(item);

      entries.push({ id: id, heading: heading, link: link });
    });

    nav.hidden = false;
    return entries;
  }

  function initializePostScrollSpy(entries) {
    if (!entries.length) {
      return;
    }

    var activeLink = null;

    function syncActive() {
      var marker = window.pageYOffset + 140;
      var current = entries[0];

      for (var i = 0; i < entries.length; i += 1) {
        if (entries[i].heading.offsetTop <= marker) {
          current = entries[i];
        } else {
          break;
        }
      }

      if (current.link === activeLink) {
        return;
      }

      if (activeLink) {
        activeLink.classList.remove('is-active');
      }

      current.link.classList.add('is-active');
      activeLink = current.link;
    }

    syncActive();
    window.addEventListener('scroll', syncActive, { passive: true });
    window.addEventListener('resize', syncActive, { passive: true });
  }

  function initializePostProgress() {
    var bar = document.querySelector('[data-post-progress]');
    var article = document.querySelector('.post-article');

    if (!bar || !article) {
      return;
    }

    function update() {
      var rect = article.getBoundingClientRect();
      var viewport = window.innerHeight || document.documentElement.clientHeight;
      var total = rect.height - viewport;
      var scrolled = total > 0 ? (-rect.top) / total : 1;
      var clamped = Math.max(0, Math.min(1, scrolled));
      bar.style.width = (clamped * 100).toFixed(2) + '%';
    }

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
  }

  function enhanceCodeBlocks(content) {
    var blocks = content.querySelectorAll('div.highlighter-rouge, figure.highlight');

    Array.prototype.forEach.call(blocks, function(block) {
      if (block.closest('.code-card')) {
        return;
      }

      var pre = block.querySelector('pre');

      if (!pre) {
        return;
      }

      var language = '';
      var match = (block.className || '').match(/language-([\w-]+)/);

      if (match) {
        language = match[1];
      }

      if (language === 'plaintext' || language === 'text') {
        language = 'code';
      }

      var card = document.createElement('div');
      card.className = 'code-card';

      var head = document.createElement('div');
      head.className = 'code-card-head';

      var label = document.createElement('span');
      label.className = 'code-card-lang';
      label.textContent = language || 'code';

      var copy = document.createElement('button');
      copy.type = 'button';
      copy.className = 'code-copy';
      copy.innerHTML = '<i data-lucide="copy" class="site-icon" aria-hidden="true"></i><span class="code-copy-label">Copy</span>';

      copy.addEventListener('click', function() {
        var code = pre.innerText.replace(/\n$/, '');

        function onCopied() {
          copy.classList.add('is-copied');
          copy.innerHTML = '<i data-lucide="check" class="site-icon" aria-hidden="true"></i><span class="code-copy-label">Copied</span>';
          initializeLucideIcons(copy);

          window.setTimeout(function() {
            copy.classList.remove('is-copied');
            copy.innerHTML = '<i data-lucide="copy" class="site-icon" aria-hidden="true"></i><span class="code-copy-label">Copy</span>';
            initializeLucideIcons(copy);
          }, 1800);
        }

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(code).then(onCopied).catch(function() {});
        } else {
          var area = document.createElement('textarea');
          area.value = code;
          area.style.position = 'fixed';
          area.style.opacity = '0';
          document.body.appendChild(area);
          area.select();
          try { document.execCommand('copy'); onCopied(); } catch {}
          document.body.removeChild(area);
        }
      });

      head.appendChild(label);
      head.appendChild(copy);

      block.parentNode.insertBefore(card, block);
      card.appendChild(head);
      card.appendChild(block);
    });
  }

  function initializePostEnhancements() {
    var content = document.querySelector('[data-post-content]');

    if (!content) {
      return;
    }

    enhanceCodeBlocks(content);
    var entries = buildPostTableOfContents(content);
    initializePostScrollSpy(entries);
    initializePostProgress();
    initializeLucideIcons(content);
  }

  function escapeSearchHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function highlightSearchTerms(text, terms) {
    var safe = escapeSearchHtml(text);
    terms.forEach(function(term) {
      if (!term) {
        return;
      }
      var escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      safe = safe.replace(new RegExp('(' + escaped + ')', 'gi'), '<mark>$1</mark>');
    });
    return safe;
  }

  // Shared ranking used by both the navbar overlay and the /search/ page so
  // results stay consistent. Every term must appear in the title or body;
  // title matches weigh heavier than body matches.
  function searchScoreDoc(doc, terms) {
    var title = (doc.title || '').toLowerCase();
    var body = (doc.body || '').toLowerCase();
    var total = 0;

    for (var i = 0; i < terms.length; i += 1) {
      var term = terms[i];
      if (!term) {
        continue;
      }
      if (title.indexOf(term) !== -1) {
        total += 12;
      } else if (body.indexOf(term) !== -1) {
        total += 4;
      } else {
        return 0;
      }
    }

    return total;
  }

  function rankSearchResults(index, query) {
    var trimmed = (query || '').trim().toLowerCase();

    if (!trimmed || !index) {
      return { terms: [], results: [] };
    }

    var terms = trimmed.split(/\s+/);
    var results = index
      .map(function(doc) { return { doc: doc, score: searchScoreDoc(doc, terms) }; })
      .filter(function(entry) { return entry.score > 0; })
      .sort(function(a, b) { return b.score - a.score; });

    return { terms: terms, results: results };
  }

  function buildSearchResultMarkup(doc, terms) {
    return (
      '<span class="site-search-result-head">' +
        '<span class="site-search-result-cat">' + escapeSearchHtml(doc.category || 'Page') + '</span>' +
        (doc.date ? '<span class="site-search-result-date">' + escapeSearchHtml(doc.date) + '</span>' : '') +
      '</span>' +
      '<span class="site-search-result-title">' + highlightSearchTerms(doc.title || '', terms) + '</span>' +
      '<span class="site-search-result-excerpt">' + highlightSearchTerms(doc.excerpt || '', terms) + '</span>'
    );
  }

  function initializeSearch() {
    var overlay = document.querySelector('[data-search-overlay]');

    if (!overlay || overlay.dataset.searchReady === 'true') {
      return;
    }

    overlay.dataset.searchReady = 'true';

    var input = overlay.querySelector('[data-search-input]');
    var resultsEl = overlay.querySelector('[data-search-results]');
    var stateEl = overlay.querySelector('[data-search-state]');
    var allLink = overlay.querySelector('[data-search-all]');
    var closeButtons = overlay.querySelectorAll('[data-search-close]');
    var openButtons = document.querySelectorAll('[data-search-open]');
    var indexUrl = overlay.getAttribute('data-search-url') || '/search.json';
    var searchPageUrl = (allLink && allLink.getAttribute('data-search-page')) || '/search/';

    var index = null;
    var loading = false;
    var results = [];
    var activeIndex = -1;
    var debounceTimer = null;
    var restoreFocus = null;

    function loadIndex() {
      if (index || loading) {
        return;
      }
      loading = true;
      window.fetch(indexUrl, { credentials: 'same-origin' })
        .then(function(response) { return response.json(); })
        .then(function(data) {
          index = Array.isArray(data) ? data : [];
          loading = false;
          if (siteSearchOpen && input.value.trim()) {
            renderResults(input.value);
          }
        })
        .catch(function() {
          loading = false;
          if (siteSearchOpen) {
            setState('Search is unavailable right now.');
          }
        });
    }

    function setState(message) {
      if (!stateEl) {
        return;
      }
      if (message) {
        stateEl.textContent = message;
        stateEl.hidden = false;
      } else {
        stateEl.hidden = true;
      }
    }

    function updateAllLink(query) {
      if (!allLink) {
        return;
      }
      var trimmed = query.trim();
      allLink.href = trimmed
        ? searchPageUrl + '?q=' + encodeURIComponent(trimmed)
        : searchPageUrl;
    }

    function setActive(nextIndex) {
      var items = resultsEl.querySelectorAll('.site-search-result');

      if (!items.length) {
        activeIndex = -1;
        return;
      }

      activeIndex = (nextIndex + items.length) % items.length;

      items.forEach(function(item, itemIndex) {
        var isActive = itemIndex === activeIndex;
        item.classList.toggle('is-active', isActive);
        var link = item.querySelector('a');
        if (link) {
          link.setAttribute('aria-selected', isActive ? 'true' : 'false');
        }
        if (isActive) {
          item.scrollIntoView({ block: 'nearest' });
        }
      });
    }

    function renderResults(query) {
      var trimmed = query.trim();
      resultsEl.innerHTML = '';
      activeIndex = -1;
      results = [];
      updateAllLink(query);

      if (!trimmed) {
        setState('Type to search posts and pages.');
        return;
      }

      if (!index) {
        setState(loading ? 'Loading…' : 'Search is unavailable right now.');
        return;
      }

      var ranked = rankSearchResults(index, query);
      var terms = ranked.terms;
      results = ranked.results.slice(0, 8);

      if (!results.length) {
        setState('No matches for “' + trimmed + '”.');
        return;
      }

      setState('');

      results.forEach(function(entry, entryIndex) {
        var doc = entry.doc;
        var item = document.createElement('li');
        item.className = 'site-search-result';
        item.setAttribute('role', 'presentation');

        var link = document.createElement('a');
        link.href = doc.url;
        link.setAttribute('role', 'option');
        link.setAttribute('aria-selected', 'false');
        link.innerHTML = buildSearchResultMarkup(doc, terms);

        item.appendChild(link);
        item.addEventListener('mousemove', function() { setActive(entryIndex); });
        resultsEl.appendChild(item);
      });

      if (allLink) {
        allLink.hidden = ranked.results.length <= results.length;
      }

      setActive(0);
    }

    function open() {
      if (siteSearchOpen) {
        return;
      }
      restoreFocus = document.activeElement;
      loadIndex();
      overlay.hidden = false;
      overlay.setAttribute('aria-hidden', 'false');
      // Force a reflow so the opening transition runs.
      void overlay.offsetWidth;
      overlay.classList.add('is-open');
      document.body.classList.add('modal-open');
      siteSearchOpen = true;
      window.requestAnimationFrame(function() {
        input.focus();
        input.select();
      });
      renderResults(input.value);
    }

    function close() {
      if (!siteSearchOpen) {
        return;
      }
      overlay.classList.remove('is-open');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
      siteSearchOpen = false;
      window.setTimeout(function() {
        if (!siteSearchOpen) {
          overlay.hidden = true;
        }
      }, 200);
      if (restoreFocus && typeof restoreFocus.focus === 'function') {
        restoreFocus.focus();
      }
    }

    openButtons.forEach(function(button) {
      button.addEventListener('click', function(event) {
        event.preventDefault();
        open();
      });
    });

    closeButtons.forEach(function(button) {
      button.addEventListener('click', function(event) {
        event.preventDefault();
        close();
      });
    });

    input.addEventListener('input', function() {
      window.clearTimeout(debounceTimer);
      debounceTimer = window.setTimeout(function() {
        renderResults(input.value);
      }, 120);
    });

    input.addEventListener('keydown', function(event) {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setActive(activeIndex + 1);
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        setActive(activeIndex - 1);
      } else if (event.key === 'Enter') {
        var links = resultsEl.querySelectorAll('.site-search-result a');
        if (activeIndex >= 0 && links[activeIndex]) {
          event.preventDefault();
          window.location.href = links[activeIndex].href;
        }
      }
    });

    openSiteSearch = open;
    closeSiteSearch = close;

    initializeLucideIcons(overlay);
  }

  // The full /search/ page — same index and ranking as the overlay, but shows
  // every match (not just the top 8) and keeps the query in the URL (?q=).
  function initializeSearchPage() {
    var page = document.querySelector('[data-search-page-url]');

    if (!page) {
      return;
    }

    var input = page.querySelector('[data-search-page-input]');
    var resultsEl = page.querySelector('[data-search-page-results]');
    var countEl = page.querySelector('[data-search-page-count]');
    var indexUrl = page.getAttribute('data-search-page-url') || '/search.json';
    var index = null;
    var debounceTimer = null;

    function getQueryParam() {
      try {
        return new URLSearchParams(window.location.search).get('q') || '';
      } catch {
        return '';
      }
    }

    function syncUrl(query) {
      var trimmed = query.trim();
      var next = window.location.pathname + (trimmed ? '?q=' + encodeURIComponent(trimmed) : '');
      window.history.replaceState(null, '', next);
    }

    function render(query) {
      var trimmed = query.trim();
      resultsEl.innerHTML = '';

      if (!trimmed) {
        countEl.textContent = '';
        return;
      }

      if (!index) {
        countEl.textContent = 'Loading…';
        return;
      }

      var ranked = rankSearchResults(index, query);
      var matches = ranked.results;

      if (!matches.length) {
        countEl.textContent = 'No matches for “' + trimmed + '”.';
        return;
      }

      countEl.textContent = matches.length + (matches.length === 1 ? ' result' : ' results') + ' for “' + trimmed + '”';

      matches.forEach(function(entry) {
        var doc = entry.doc;
        var item = document.createElement('li');
        item.className = 'site-search-result search-page-result';

        var link = document.createElement('a');
        link.href = doc.url;
        link.innerHTML = buildSearchResultMarkup(doc, ranked.terms);

        item.appendChild(link);
        resultsEl.appendChild(item);
      });
    }

    function loadIndex() {
      window.fetch(indexUrl, { credentials: 'same-origin' })
        .then(function(response) { return response.json(); })
        .then(function(data) {
          index = Array.isArray(data) ? data : [];
          render(input.value);
        })
        .catch(function() {
          countEl.textContent = 'Search is unavailable right now.';
        });
    }

    input.value = getQueryParam();

    input.addEventListener('input', function() {
      window.clearTimeout(debounceTimer);
      debounceTimer = window.setTimeout(function() {
        syncUrl(input.value);
        render(input.value);
      }, 120);
    });

    loadIndex();
    input.focus();
  }

  function initializeVersion3Scripts() {
    initializeGlobalEvents();
    initializePageTransitions();
    initializeScrollReveals(document);
    initializeThemeToggles();
    initializeMobileNavigation();
    initializeProjectFilters();
    initializeModals();
    initializeContactForm();
    initializeAutoResizeTextareas();
    initializeNavigationState();
    initializeScrollTopControl();
    initializePostEnhancements();
    initializeSearch();
    initializeSearchPage();
    initializeLucideIcons(document);

    document.dispatchEvent(new Event('version3:page-ready'));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeVersion3Scripts);
  } else {
    initializeVersion3Scripts();
  }
})();
