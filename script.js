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
