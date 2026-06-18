/**
 * Expat Teacher's Lounge Custom Shopify Theme JS
 * Handles dynamic interactions (header state, mobile nav, interactions).
 */

function runInit() {
  initStickyHeader();
  initMobileMenu();
  initQuantitySelectors();
  initProductVariants();
  initProfilePictureFix();
  initArticleLayoutFix();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', runInit);
} else {
  runInit();
}

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

/**
 * Client-side profile picture and image path fix helper.
 * Redirects hardcoded Next.js paths to Shopify CDN URLs and handles broken images.
 */
function initProfilePictureFix() {
  const headshotUrl = 'https://cdn.shopify.com/s/files/1/0823/4391/9830/files/Edwina_headshot.png?v=1780168908';
  
  const fixImage = (img) => {
    const src = img.getAttribute('src') || '';
    if (src.includes('Edwina_headshot') || img.alt.includes('Edwina')) {
      if (img.src !== headshotUrl) {
        img.src = headshotUrl;
      }
    }
  };

  // Run on all existing images
  document.querySelectorAll('img').forEach(fixImage);

  // Monitor DOM for dynamically added/changed images
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.tagName === 'IMG') {
          fixImage(node);
        } else if (node.querySelectorAll) {
          node.querySelectorAll('img').forEach(fixImage);
        }
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // Handle any images that fail to load
  window.addEventListener('error', function(e) {
    if (e.target && e.target.tagName === 'IMG') {
      const img = e.target;
      if (img.src.includes('Edwina_headshot') || img.alt.includes('Edwina')) {
        if (img.src !== headshotUrl) {
          img.src = headshotUrl;
        }
      }
    }
  }, true);
}

/**
 * Clean up hardcoded grid structures and sidebars copy-pasted into article body content.
 * Forces the text column to expand to full-width and removes float offsets.
 */
function initArticleLayoutFix() {
  const content = document.querySelector('.article-content');
  if (!content) return;
  
  // Find any sidebars and remove them from layout
  const sidebars = content.querySelectorAll('.blog-sidebar, .sidebar, aside, [class*="sidebar"]');
  sidebars.forEach(el => el.remove());
  
  // Find all child elements inside article content
  const elements = content.querySelectorAll('*');
  elements.forEach(el => {
    const style = el.getAttribute('style') || '';
    
    // Check if display grid/flex is set inline
    if (style.includes('display: grid') || style.includes('display: flex') || 
        style.includes('display:flex') || style.includes('display:grid')) {
      el.style.display = 'block';
      el.style.gridTemplateColumns = 'none';
      el.style.gap = '0';
    }
    
    // Check for inline widths (including decimal percentages like 66.666%)
    if (style.includes('width:') || style.includes('width :')) {
      const widthMatch = style.match(/width\s*:\s*([\d\.]+)%/);
      if (widthMatch) {
        const widthVal = parseFloat(widthMatch[1]);
        if (widthVal > 40 && widthVal < 100) {
          el.style.width = '100%';
          el.style.maxWidth = '100%';
        }
      }
    }
    
    // Check for inline flex-basis (including decimal percentages)
    if (style.includes('flex-basis:') || style.includes('flex-basis :')) {
      const flexMatch = style.match(/flex-basis\s*:\s*([\d\.]+)%/);
      if (flexMatch) {
        const flexVal = parseFloat(flexMatch[1]);
        if (flexVal > 40 && flexVal < 100) {
          el.style.flexBasis = '100%';
        }
      }
    }
    
    // Remove floats
    if (style.includes('float:') || style.includes('float :')) {
      el.style.float = 'none';
    }
  });
}

