/**
 * Expat Teacher's Lounge Custom Shopify Theme JS
 * Handles dynamic interactions (header state, mobile nav, interactions).
 */

document.addEventListener('DOMContentLoaded', function() {
  initStickyHeader();
  initMobileMenu();
  initQuantitySelectors();
  initProductVariants();
});

/**
 * Sticky Header handler
 * Transitions navbar style from transparent to a premium frosted-glass design on scroll
 */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('site-header--scrolled');
    } else {
      header.classList.remove('site-header--scrolled');
    }
  };

  // Run on load in case page starts scrolled
  handleScroll();
  window.addEventListener('scroll', handleScroll, { passive: true });
}

/**
 * Mobile Navigation Drawer handler
 */
function initMobileMenu() {
  const toggle = document.querySelector('.mobile-nav-toggle');
  const drawer = document.querySelector('.mobile-menu-drawer');
  if (!toggle || !drawer) return;

  toggle.addEventListener('click', function(e) {
    e.stopPropagation();
    const isActive = drawer.classList.toggle('is-active');
    
    // Animate hamburger lines
    const spans = toggle.querySelectorAll('span');
    if (isActive) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
    } else {
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    }
  });

  // Close drawer if user clicks outside
  document.addEventListener('click', function(e) {
    if (drawer.classList.contains('is-active') && !drawer.contains(e.target)) {
      drawer.classList.remove('is-active');
      const spans = toggle.querySelectorAll('span');
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    }
  });
}

/**
 * Handles custom quantity selector +/- adjustments
 */
function initQuantitySelectors() {
  const quantites = document.querySelectorAll('.quantity-selector');
  quantites.forEach(selector => {
    const input = selector.querySelector('.quantity-input');
    const minus = selector.querySelector('.quantity-btn--minus');
    const plus = selector.querySelector('.quantity-btn--plus');
    if (!input || !minus || !plus) return;

    minus.addEventListener('click', () => {
      let val = parseInt(input.value) || 1;
      if (val > 1) input.value = val - 1;
      input.dispatchEvent(new Event('change'));
    });

    plus.addEventListener('click', () => {
      let val = parseInt(input.value) || 1;
      input.value = val + 1;
      input.dispatchEvent(new Event('change'));
    });
  });
}

/**
 * Handles Shopify Product Variant Selection and UI Updates
 */
function initProductVariants() {
  const form = document.querySelector('.shopify-product-form');
  if (!form) return;

  const selector = form.querySelector('.product-form__variant-selector');
  if (!selector) return;

  selector.addEventListener('change', function(e) {
    const option = e.target.options[e.target.selectedIndex];
    if (!option) return;

    // Update variant price on UI
    const price = option.dataset.price;
    const priceDisplay = document.querySelector('.product-single__price');
    if (priceDisplay && price) {
      priceDisplay.innerHTML = price;
    }

    // Update Add to Cart Button state
    const addToCartBtn = form.querySelector('[name="add"]');
    if (addToCartBtn) {
      if (option.dataset.available === 'true') {
        addToCartBtn.removeAttribute('disabled');
        addToCartBtn.innerText = addToCartBtn.dataset.addText || 'Add to cart';
      } else {
        addToCartBtn.setAttribute('disabled', 'disabled');
        addToCartBtn.innerText = addToCartBtn.dataset.soldOutText || 'Sold out';
      }
    }
  });
}
