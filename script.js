// ============================================================
// OFIR BEKER ARCHITECTURE — Portfolio Site JS
// ============================================================

// --- Header scroll effect + scroll-to-top button ---
const header = document.getElementById('site-header');
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
  if (window.scrollY > 400) {
    scrollTopBtn.classList.add('visible');
  } else {
    scrollTopBtn.classList.remove('visible');
  }
}, { passive: true });

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

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


// --- Lightbox with navigation ---
const lightbox      = document.getElementById('lightbox');
const lightboxImg   = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev  = document.getElementById('lightboxPrev');
const lightboxNext  = document.getElementById('lightboxNext');
const lightboxCounter = document.getElementById('lightboxCounter');

if (lightbox) {
  let currentImages = [];
  let currentIndex  = 0;

  // Gallery open (called via onclick="galleryOpen(this)" in HTML)
  window.galleryOpen = function(clickedImg) {
    const wrap = clickedImg.closest('.project-image-wrap');
    if (!wrap) return;
    currentImages = Array.from(wrap.querySelectorAll('img'));
    currentIndex  = currentImages.indexOf(clickedImg);
    if (currentIndex === -1) currentIndex = 0;
    openLightbox(currentIndex);
  };

  // Sketches gallery — all sketch images as one navigable set
  const sketchImgs = document.querySelectorAll('.sketch-item img');
  sketchImgs.forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => {
      currentImages = Array.from(sketchImgs);
      currentIndex  = currentImages.indexOf(img);
      openLightbox(currentIndex);
    });
  });

  function openLightbox(index) {
    lightboxImg.src = currentImages[index].src;
    lightboxImg.alt = currentImages[index].alt;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    updateNav();
  }

  function updateNav() {
    const total = currentImages.length;
    const showNav = total > 1;
    lightboxPrev.style.display = showNav ? 'flex' : 'none';
    lightboxNext.style.display = showNav ? 'flex' : 'none';
    lightboxPrev.disabled = currentIndex === 0;
    lightboxNext.disabled = currentIndex === total - 1;
    lightboxCounter.textContent = showNav ? `${currentIndex + 1} / ${total}` : '';
  }

  lightboxPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    if (currentIndex > 0) { currentIndex--; openLightbox(currentIndex); }
  });

  lightboxNext.addEventListener('click', (e) => {
    e.stopPropagation();
    if (currentIndex < currentImages.length - 1) { currentIndex++; openLightbox(currentIndex); }
  });

  // Global function called directly from img onclick in HTML
  window.lightboxImgClick = function() {
    if (currentIndex < currentImages.length - 1) {
      currentIndex++;
      openLightbox(currentIndex);
    }
  };

  // Close on overlay background click
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  lightboxClose.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft'  && currentIndex < currentImages.length - 1) { currentIndex++; openLightbox(currentIndex); }
    if (e.key === 'ArrowRight' && currentIndex > 0) { currentIndex--; openLightbox(currentIndex); }
  });

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    lightboxImg.removeAttribute('src');
    currentImages = [];
  }
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
