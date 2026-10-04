/* Teacher Moves theme interactions: mobile menu, subtle reveals, sticky CTA. */
(function () {
  document.documentElement.classList.remove('no-js');

  function initMenu() {
    var toggle = document.querySelector('[data-tm-menu-toggle]');
    var drawer = document.getElementById('tm-drawer');
    if (!toggle || !drawer) return;
    toggle.addEventListener('click', function () {
      var open = drawer.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
        drawer.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open menu');
        toggle.focus();
      }
    });
  }

  function initReveal() {
    var items = document.querySelectorAll('.tm-reveal');
    if (!items.length) return;
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      items.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  }

  function initSticky() {
    var bar = document.querySelector('[data-tm-sticky]');
    var trigger = document.querySelector('[data-tm-sticky-trigger]');
    if (!bar || !trigger) return;
    if (!('IntersectionObserver' in window)) { bar.classList.add('is-visible'); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        bar.classList.toggle('is-visible', !entry.isIntersecting && entry.boundingClientRect.top < 0);
      });
    });
    io.observe(trigger);
  }

  function initFooter() {
    var cols = document.querySelectorAll('[data-tm-footer-col]');
    if (!cols.length) return;
    var mq = window.matchMedia('(max-width: 749px)');
    function apply() {
      cols.forEach(function (d) { if (mq.matches) d.removeAttribute('open'); else d.setAttribute('open', ''); });
    }
    cols.forEach(function (d) {
      var s = d.querySelector('summary');
      if (s) s.addEventListener('click', function (e) { if (!mq.matches) e.preventDefault(); });
    });
    apply();
    if (mq.addEventListener) mq.addEventListener('change', apply);
  }

  function run() { initMenu(); initReveal(); initSticky(); initFooter(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();
