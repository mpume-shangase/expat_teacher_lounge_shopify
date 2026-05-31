/* Expat Teacher's Lounge - Shopify Theme JS */
(function() {
  'use strict';

  /* --- Navbar scroll behaviour --- */
  const header = document.querySelector('.site-header');
  function onScroll() {
    if (window.scrollY > 80) {
      header && header.classList.add('site-header--scrolled');
    } else {
      header && header.classList.remove('site-header--scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* --- Mobile menu toggle --- */
  const toggle = document.querySelector('.mobile-toggle');
  const mobileNav = document.querySelector('.site-nav-mobile');
  if (toggle && mobileNav) {
    toggle.addEventListener('click', function() {
      mobileNav.classList.toggle('open');
      const isOpen = mobileNav.classList.contains('open');
      toggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    // Close on link click
    mobileNav.querySelectorAll('a').forEach(function(a) {
      a.addEventListener('click', function() {
        mobileNav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* --- Active nav link --- */
  const currentPath = window.location.pathname;
  document.querySelectorAll('.site-header__nav a, .site-nav-mobile a').forEach(function(a) {
    const href = a.getAttribute('href');
    if (href === '/' ? currentPath === '/' : currentPath.startsWith(href)) {
      a.classList.add('active');
    }
  });

  /* --- Scroll reveal animations --- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function(el) { observer.observe(el); });
  } else {
    revealEls.forEach(function(el) { el.classList.add('visible'); });
  }

  /* --- CountUp for proof bar stats --- */
  function animateCount(el, end, suffix) {
    const duration = 2000;
    const start = performance.now();
    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * end) + (suffix || '');
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  const statEls = document.querySelectorAll('[data-countup]');
  if (statEls.length && 'IntersectionObserver' in window) {
    const countObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          const el = entry.target;
          animateCount(el, parseInt(el.dataset.countup, 10), el.dataset.suffix || '');
          countObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    statEls.forEach(function(el) { countObserver.observe(el); });
  }

  /* --- Coaching package selector --- */
  document.querySelectorAll('.package-card').forEach(function(card) {
    card.addEventListener('click', function() {
      document.querySelectorAll('.package-card').forEach(function(c) { c.classList.remove('selected'); });
      card.classList.add('selected');
      const nameInput = document.getElementById('selected-package');
      if (nameInput) nameInput.value = card.querySelector('.package-card__name').textContent;
    });
  });

  /* --- Cart count badge update --- */
  function updateCartCount() {
    fetch('/cart.js')
      .then(function(r) { return r.json(); })
      .then(function(cart) {
        const badge = document.querySelector('.cart-icon__count');
        if (badge) badge.textContent = cart.item_count;
      })
      .catch(function() {});
  }
  updateCartCount();

  /* --- Add to cart (AJAX) --- */
  const addToCartForm = document.querySelector('[data-add-to-cart-form]');
  if (addToCartForm) {
    addToCartForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const formData = new FormData(addToCartForm);
      const btn = addToCartForm.querySelector('[data-add-to-cart-btn]');
      if (btn) { btn.disabled = true; btn.textContent = 'Adding...'; }
      fetch('/cart/add.js', { method: 'POST', body: formData })
        .then(function(r) { return r.json(); })
        .then(function() {
          if (btn) { btn.disabled = false; btn.textContent = 'Added!'; }
          updateCartCount();
          setTimeout(function() {
            if (btn) btn.textContent = btn.dataset.label || 'Add to Cart';
          }, 2000);
        })
        .catch(function() {
          if (btn) { btn.disabled = false; btn.textContent = 'Error - try again'; }
        });
    });
  }

  /* --- Qty stepper in cart / product page --- */
  document.querySelectorAll('.qty-stepper').forEach(function(stepper) {
    const minus = stepper.querySelector('[data-minus]');
    const plus = stepper.querySelector('[data-plus]');
    const input = stepper.querySelector('input');
    if (minus && plus && input) {
      minus.addEventListener('click', function() {
        const val = parseInt(input.value, 10);
        if (val > 1) input.value = val - 1;
      });
      plus.addEventListener('click', function() {
        input.value = parseInt(input.value, 10) + 1;
      });
    }
  });

  /* --- Email capture form --- */
  const emailForm = document.querySelector('[data-email-form]');
  if (emailForm) {
    emailForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const emailInput = emailForm.querySelector('input[type="email"]');
      const btn = emailForm.querySelector('button[type="submit"]');
      if (!emailInput || !emailInput.value) return;
      if (btn) { btn.disabled = true; btn.textContent = 'Subscribing...'; }
      // Shopify uses /contact for newsletter submissions
      const data = new FormData();
      data.append('contact[email]', emailInput.value);
      data.append('form_type', 'customer');
      fetch('/contact', { method: 'POST', body: data })
        .then(function() {
          emailInput.value = '';
          if (btn) btn.textContent = 'Subscribed!';
          emailForm.innerHTML = '<p style="color:#fff;font-size:1.1rem">Thank you! Check your inbox.</p>';
        })
        .catch(function() {
          if (btn) { btn.disabled = false; btn.textContent = 'Subscribe'; }
        });
    });
  }

  /* --- Hero image parallax (subtle) --- */
  const heroImg = document.querySelector('.hero__image-col');
  if (heroImg) {
    window.addEventListener('scroll', function() {
      const scrolled = window.scrollY;
      heroImg.style.transform = 'translateY(' + (scrolled * 0.12) + 'px)';
    }, { passive: true });
  }

})();
