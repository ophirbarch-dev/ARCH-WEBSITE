// ============================================================
// OFIR BEKER ARCHITECTURE — Portfolio Site JS
// ============================================================

// --- Header scroll effect ---
const header = document.getElementById('site-header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}, { passive: true });

// --- Mobile hamburger ---
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');

hamburger.addEventListener('click', () => {
  mobileNav.classList.toggle('open');
});

// Close mobile nav on link click
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileNav.classList.remove('open');
  });
});

// --- Smooth scroll for all anchor links ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = document.getElementById('site-header').offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// --- Contact form submission (demo) ---
function handleSubmit(e) {
  e.preventDefault();
  const success = document.getElementById('form-success');
  success.classList.add('visible');
  e.target.reset();
  setTimeout(() => success.classList.remove('visible'), 5000);
}

// --- Fade-in on scroll (Intersection Observer) ---
const observerOptions = {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Add fade class to elements
const fadeTargets = document.querySelectorAll(
  '.about-text, .about-stats, .project-info, .project-image-wrap, .contact-text, .contact-form'
);
fadeTargets.forEach(el => {
  el.classList.add('fade-in');
  observer.observe(el);
});
