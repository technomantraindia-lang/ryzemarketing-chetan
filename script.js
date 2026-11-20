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
