const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }));
}

const verticalsDropdown = document.querySelector('.nav-dropdown-wrap');
const verticalsTrigger = document.querySelector('.nav-dropdown-trigger');
if (verticalsDropdown && verticalsTrigger) {
  const closeVerticalsDropdown = () => {
    verticalsDropdown.classList.remove('is-open');
    verticalsTrigger.setAttribute('aria-expanded', 'false');
  };

  verticalsTrigger.addEventListener('click', () => {
    const open = verticalsDropdown.classList.toggle('is-open');
    verticalsTrigger.setAttribute('aria-expanded', String(open));
  });

  verticalsDropdown.querySelectorAll('.nav-dropdown a').forEach((link) => {
    link.addEventListener('click', closeVerticalsDropdown);
  });

  document.addEventListener('click', (event) => {
    if (!verticalsDropdown.contains(event.target)) closeVerticalsDropdown();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeVerticalsDropdown();
      verticalsTrigger.focus();
    }
  });
}

const header = document.querySelector('[data-header]');
window.addEventListener('scroll', () => {
  if (header) header.classList.toggle('scrolled', window.scrollY > 12);
}, { passive: true });

const year = document.querySelector('[data-year]');
if (year) year.textContent = new Date().getFullYear();

// Keep the business verticals directly below the About section in the page flow.
const aboutSection = document.querySelector('.about-reference:not(.about-reference-later)');
const verticalsSection = document.querySelector('.verticals-showcase');
if (aboutSection && verticalsSection) {
  aboutSection.insertAdjacentElement('afterend', verticalsSection);
}

// Keep the Brands Associated With section directly above Testimonials.
const brandsPlacementSection = document.querySelector('.brands-section');
const testimonialsPlacementSection = document.querySelector('.testimonials-section');
if (brandsPlacementSection && testimonialsPlacementSection) {
  testimonialsPlacementSection.insertAdjacentElement('beforebegin', brandsPlacementSection);
}

const heroVideo = document.querySelector('.hero-video');
if (heroVideo) {
  heroVideo.defaultPlaybackRate = 0.8;
  heroVideo.playbackRate = 0.8;
  heroVideo.addEventListener('loadedmetadata', () => {
    heroVideo.playbackRate = 0.8;
  }, { once: true });
}

// Four Business Verticals Carousel Slider
const sliderTrack = document.querySelector('.verticals-track');
const prevBtn = document.querySelector('.verticals-arrow.prev');
const nextBtn = document.querySelector('.verticals-arrow.next');
const dots = document.querySelectorAll('.verticals-dots .dot');

if (sliderTrack) {
  const getScrollStep = () => {
    const firstCard = sliderTrack.querySelector('.vertical-card');
    return firstCard ? firstCard.offsetWidth + 22 : 300;
  };

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const maxScroll = sliderTrack.scrollWidth - sliderTrack.clientWidth;
      if (sliderTrack.scrollLeft >= maxScroll - 10) {
        sliderTrack.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        sliderTrack.scrollBy({ left: getScrollStep(), behavior: 'smooth' });
      }
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (sliderTrack.scrollLeft <= 10) {
        sliderTrack.scrollTo({ left: sliderTrack.scrollWidth, behavior: 'smooth' });
      } else {
        sliderTrack.scrollBy({ left: -getScrollStep(), behavior: 'smooth' });
      }
    });
  }

  // Sync pagination indicator dots with scroll position
  const updateActiveDot = () => {
    if (!dots.length) return;
    const maxScroll = sliderTrack.scrollWidth - sliderTrack.clientWidth;
    if (maxScroll <= 0) {
      dots.forEach((dot, i) => dot.classList.toggle('active', i === 0));
      return;
    }
    const ratio = Math.max(0, Math.min(1, sliderTrack.scrollLeft / maxScroll));
    const activeIndex = Math.round(ratio * (dots.length - 1));
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === activeIndex);
    });
  };

  sliderTrack.addEventListener('scroll', updateActiveDot, { passive: true });

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      const maxScroll = sliderTrack.scrollWidth - sliderTrack.clientWidth;
      const targetScroll = (index / (dots.length - 1)) * maxScroll;
      sliderTrack.scrollTo({ left: targetScroll, behavior: 'smooth' });
    });
  });
}

// Testimonials: infinite multi-card loop with a seamless right-to-left handoff.
const testimonialsSection = document.querySelector('.testimonials-section');
const testimonialsTrack = document.querySelector('.testimonials-track');

if (testimonialsSection && testimonialsTrack) {
  const originalTestimonialCards = Array.from(testimonialsTrack.children);
  const originalCardCount = originalTestimonialCards.length;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let testimonialTimer = null;
  let carouselStarted = false;
  let currentTestimonialIndex = 0;
  let isMoving = false;

  originalTestimonialCards.forEach((card) => {
    const clone = card.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    clone.dataset.testimonialClone = 'true';
    clone.querySelectorAll('a, button, input, select, textarea').forEach((control) => {
      control.setAttribute('tabindex', '-1');
    });
    testimonialsTrack.appendChild(clone);
  });

  const getTestimonialStep = () => {
    const firstCard = testimonialsTrack.querySelector('.testimonial-card');
    if (!firstCard) return 0;
    const trackStyles = window.getComputedStyle(testimonialsTrack);
    const gap = parseFloat(trackStyles.columnGap || trackStyles.gap) || 0;
    return firstCard.getBoundingClientRect().width + gap;
  };

  const moveToNextTestimonial = () => {
    if (isMoving) return;
    const step = getTestimonialStep();
    if (!step) return;
    isMoving = true;
    currentTestimonialIndex += 1;
    testimonialsTrack.style.transform = `translate3d(-${currentTestimonialIndex * step}px, 0, 0)`;
  };

  const startTestimonialsCarousel = () => {
    if (carouselStarted || prefersReducedMotion) return;
    carouselStarted = true;
    testimonialTimer = window.setInterval(moveToNextTestimonial, 4500);
  };

  testimonialsTrack.addEventListener('transitionend', (event) => {
    if (event.propertyName !== 'transform' || !isMoving) return;
    if (currentTestimonialIndex >= originalCardCount) {
      testimonialsTrack.style.transition = 'none';
      currentTestimonialIndex = 0;
      testimonialsTrack.style.transform = `translate3d(0, 0, 0)`;
      requestAnimationFrame(() => {
        testimonialsTrack.style.transition = '';
        isMoving = false;
      });
      return;
    }
    isMoving = false;
  });

  testimonialsSection.classList.add('has-reveal');
  const resetTestimonialPosition = () => {
    testimonialsTrack.style.transition = 'none';
    currentTestimonialIndex = 0;
    testimonialsTrack.style.transform = 'translate3d(0, 0, 0)';
    requestAnimationFrame(() => {
      testimonialsTrack.style.transition = '';
      isMoving = false;
    });
  };
  requestAnimationFrame(resetTestimonialPosition);
  window.addEventListener('load', resetTestimonialPosition, { once: true });
  window.addEventListener('resize', resetTestimonialPosition, { passive: true });

  if ('IntersectionObserver' in window) {
    const testimonialsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          testimonialsSection.classList.add('is-visible');
          startTestimonialsCarousel();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18 });
    testimonialsObserver.observe(testimonialsSection);
  } else {
    testimonialsSection.classList.add('is-visible');
    startTestimonialsCarousel();
  }

  window.addEventListener('pagehide', () => {
    if (testimonialTimer) window.clearInterval(testimonialTimer);
  }, { once: true });
}

// Industries: reveal cards from different directions as the section enters view.
const industriesSection = document.querySelector('.industries-section');
if (industriesSection) {
  industriesSection.classList.add('has-reveal');
  const showIndustries = () => industriesSection.classList.add('is-visible');

  if ('IntersectionObserver' in window) {
    const industriesObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          showIndustries();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    industriesObserver.observe(industriesSection);
  } else {
    showIndustries();
  }
}

// Trusted brands: reveal the heading and logos in a staggered sequence.
const brandsSection = document.querySelector('.brands-section');
if (brandsSection) {
  brandsSection.classList.add('has-reveal');
  const showBrands = () => brandsSection.classList.add('is-visible');

  if ('IntersectionObserver' in window) {
    const brandsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          showBrands();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18 });
    brandsObserver.observe(brandsSection);
  } else {
    showBrands();
  }
}

// Home page entrance animations: reveal each visible section once as it enters the viewport.
const homeEntranceSections = [
  { selector: '.hero', targets: ['.hero-video'], name: 'hero' },
  { selector: '.about-reference:not([aria-hidden="true"])', targets: ['.about-reference-inner'], name: 'about' },
  { selector: '.why-choose-section', targets: ['.why-choose-layout'], name: 'why' },
  { selector: '.verticals-showcase', targets: ['.verticals-container'], name: 'verticals' },
  { selector: '.industries-section', targets: ['.industries-header', '.industries-arch-stage'], name: 'industries' },
  { selector: '.testimonials-section', targets: ['.testimonials-inner'], name: 'testimonials' },
  { selector: '.brands-section', targets: ['.brands-inner'], name: 'brands' },
  { selector: '.process-section:not([aria-hidden="true"])', targets: ['.process-container'], name: 'process' },
  { selector: '.cta-reference', targets: ['.cta-reference-inner'], name: 'cta' }
];

const createEntranceObserver = (section, threshold) => {
  if (!('IntersectionObserver' in window)) return null;

  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      currentObserver.unobserve(entry.target);
    });
  }, { threshold, rootMargin: '0px' });

  observer.observe(section);
  return observer;
};

homeEntranceSections.forEach(({ selector, targets, name }) => {
  document.querySelectorAll(selector).forEach((section) => {
    section.classList.add('home-entrance', `home-entrance-${name}`);
    targets.forEach((targetSelector) => {
      section.querySelectorAll(targetSelector).forEach((target) => {
        target.classList.add('home-entrance-target');
      });
    });

    const sectionObserver = createEntranceObserver(section, name === 'about' ? 0.45 : 0.25);
    if (!sectionObserver) {
      section.classList.add('is-visible');
    }
  });
});

// ==========================================================================
// Enquiry Popup Modal Controller
// ==========================================================================
const enquiryModal = document.getElementById('enquiryModal');
const closeEnquiryBtn = document.getElementById('closeEnquiryModal');
const enquiryForm = document.getElementById('enquiryPopupForm');
const popupFeedback = document.getElementById('popupFeedback');
const popupSelect = document.getElementById('popupRequirement');
const popupService = document.getElementById('popupService');
const popupSubmitBtn = document.getElementById('popupSubmitBtn');

const enquiryServiceOptions = {
  'personalised-inputs': [
    'Doctor Inputs',
    'Desk Accessories',
    'Calendars & Planners',
    'Patient Engagement Kits',
    'Promotional Merchandise',
    'Custom Campaign Kits'
  ],
  'corporate-gifting': [
    'Executive Gift Sets',
    'Employee Welcome Kits',
    'Client Appreciation Gifts',
    'Festive Gift Boxes',
    'Premium Drinkware',
    'Custom Gift Hampers'
  ],
  'events-exhibitions': [
    'Event Starter Kits',
    'Exhibition Displays',
    'Conference Gifting',
    'Launch Experiences',
    'Booth Essentials',
    'Event Merchandise'
  ],
  'branding-marketing': [
    'Brand Identity Kits',
    'Campaign Collateral',
    'Digital Brand Assets',
    'Packaging & Print',
    'Promotional Branding',
    'Custom Brand Experiences'
  ]
};
window.ryzeEnquiryServiceOptions = enquiryServiceOptions;

function populateServiceOptions(category = '') {
  if (!popupService) return;

  popupService.innerHTML = '<option value="" selected>What would you like us to create? *</option>';
  const options = enquiryServiceOptions[category] || [];

  options.forEach((label) => {
    const option = document.createElement('option');
    option.value = label.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    option.textContent = label;
    popupService.appendChild(option);
  });

  popupService.disabled = options.length === 0;
  popupService.classList.remove('selected-active');
}

function openEnquiryModal(category = '') {
  if (!enquiryModal) return;

  const selectedCategory = category || document.body.dataset.enquiryCategory || '';
  if (popupSelect) {
    popupSelect.value = selectedCategory;
    popupSelect.classList.toggle('selected-active', Boolean(selectedCategory));
  }
  populateServiceOptions(selectedCategory);

  enquiryModal.classList.add('is-open');
  enquiryModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  const firstInput = document.getElementById('popupName');
  if (firstInput) {
    setTimeout(() => firstInput.focus(), 150);
  }
}

function closeEnquiryModal() {
  if (!enquiryModal) return;
  enquiryModal.classList.remove('is-open');
  enquiryModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

// Open modal triggers
document.querySelectorAll('[data-open-enquiry], .nav-cta, .enquire-now-trigger').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    if (enquiryModal) {
      e.preventDefault();
      openEnquiryModal(btn.dataset.enquiryCategory || '');
    }
  });
});

// Close triggers
if (closeEnquiryBtn) {
  closeEnquiryBtn.addEventListener('click', closeEnquiryModal);
}

if (enquiryModal) {
  // Click outside to close
  enquiryModal.addEventListener('click', (e) => {
    if (e.target === enquiryModal) {
      closeEnquiryModal();
    }
  });

  // ESC key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && enquiryModal.classList.contains('is-open')) {
      closeEnquiryModal();
    }
  });
}

// Custom select styling
if (popupSelect) {
  popupSelect.addEventListener('change', function () {
    if (this.value) {
      this.classList.add('selected-active');
    } else {
      this.classList.remove('selected-active');
    }
    populateServiceOptions(this.value);
  });
}

// Form submission & validation
if (enquiryForm && popupFeedback) {
  enquiryForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('popupName');
    const email = document.getElementById('popupEmail');
    const phone = document.getElementById('popupPhone');
    const requirement = document.getElementById('popupRequirement');
    const service = document.getElementById('popupService');

    let isValid = true;
    [name, email, phone, requirement, service].forEach((field) => {
      if (field) {
        const box = field.closest('.popup-input-box');
        if (!field.value.trim()) {
          isValid = false;
          if (box) box.classList.add('has-error');
        } else {
          if (box) box.classList.remove('has-error');
        }
      }
    });

    if (email && email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      isValid = false;
      const box = email.closest('.popup-input-box');
      if (box) box.classList.add('has-error');
    }

    if (!isValid) {
      popupFeedback.className = 'popup-feedback error';
      popupFeedback.textContent = 'Please fill in all required fields marked with * correctly.';
      return;
    }

    if (popupSubmitBtn) {
      popupSubmitBtn.disabled = true;
      popupSubmitBtn.style.opacity = '0.7';
      popupSubmitBtn.innerHTML = 'Submitting...';
    }

    setTimeout(() => {
      enquiryForm.reset();
      const pageCategory = document.body.dataset.enquiryCategory || '';
      if (popupSelect) {
        popupSelect.value = pageCategory;
        popupSelect.classList.toggle('selected-active', Boolean(pageCategory));
      }
      populateServiceOptions(pageCategory);
      if (popupSubmitBtn) {
        popupSubmitBtn.disabled = false;
        popupSubmitBtn.style.opacity = '1';
        popupSubmitBtn.innerHTML = '<span>Submit Enquiry</span><svg class="button-icon" aria-hidden="true"><use href="#icon-arrow" /></svg>';
      }

      popupFeedback.className = 'popup-feedback success';
      popupFeedback.textContent = 'Thank you! Your enquiry has been received. Our team will get back to you shortly.';

      setTimeout(() => {
        closeEnquiryModal();
        popupFeedback.className = 'popup-feedback';
        popupFeedback.textContent = '';
      }, 3000);
    }, 700);
  });

  // Clear errors on input
  enquiryForm.querySelectorAll('input, select, textarea').forEach((input) => {
    input.addEventListener('input', function () {
      const box = this.closest('.popup-input-box');
      if (box) box.classList.remove('has-error');
      if (popupFeedback.classList.contains('error')) {
        popupFeedback.className = 'popup-feedback';
        popupFeedback.textContent = '';
      }
    });
  });
}
