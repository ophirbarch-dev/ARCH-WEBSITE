// ============================================================
// OFIR BEKER ARCHITECTURE — Portfolio Site JS
// ============================================================

// --- Project Modal ---
(function () {
  const modal = document.getElementById('projModal');
  if (!modal) return;

  const modalInner = modal.querySelector('.proj-modal-inner');
  const closeBtn   = document.getElementById('projModalClose');

  window.openProjModal = function (card) {
    const tmpl = document.getElementById(card.dataset.modal);
    if (!tmpl) return;

    modalInner.innerHTML = '';
    modalInner.appendChild(tmpl.content.cloneNode(true));

    // Thumbnail switching inside modal
    const thumbs  = modalInner.querySelectorAll('.proj-modal-thumbs img');
    const mainImg = modalInner.querySelector('.proj-modal-gallery-main');
    if (thumbs.length && mainImg) {
      // Build ordered image list: all thumbs (first thumb = same as main, so use mainImg)
      const allImgs = [mainImg, ...Array.from(thumbs).slice(1)];

      thumbs.forEach((thumb, i) => {
        thumb.addEventListener('click', () => {
          mainImg.src = thumb.src;
          mainImg.alt = thumb.alt;
          thumbs.forEach(t => t.classList.remove('active'));
          thumb.classList.add('active');
        });
      });

      // Click main image → open lightbox with full nav support
      mainImg.addEventListener('click', () => {
        const currentThumbIdx = Array.from(thumbs).findIndex(t => t.classList.contains('active'));
        const startIdx = Math.max(0, currentThumbIdx);
        if (window.openLightboxWith) {
          window.openLightboxWith(Array.from(thumbs), startIdx);
        }
      });
    } else if (mainImg) {
      // Single image — click opens lightbox
      mainImg.addEventListener('click', () => {
        if (window.openLightboxWith) window.openLightboxWith([mainImg], 0);
      });
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeProjModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeProjModal(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeProjModal();
  });

  function closeProjModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
})();

// --- Custom Cursor ---
(function () {
  if (window.matchMedia('(hover: none)').matches) return; // touch devices

  const dot  = document.createElement('div');
  dot.className = 'custom-cursor-dot';
  const ring = document.createElement('div');
  ring.className = 'custom-cursor-ring';
  document.body.appendChild(dot);
  document.body.appendChild(ring);
  document.body.classList.add('custom-cursor-active');

  let mx = -200, my = -200;
  let rx = -200, ry = -200;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  }, { passive: true });

  (function animRing() {
    rx += (mx - rx) * 0.13;
    ry += (my - ry) * 0.13;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animRing);
  })();

  const hoverSel = 'a, button, .proj-card, input, textarea, select, label, [onclick]';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverSel)) document.body.classList.add('cursor-hovering');
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverSel)) document.body.classList.remove('cursor-hovering');
  });

  document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity  = '1';
    ring.style.opacity = '1';
  });
})();

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

  // Expose so modal can open lightbox with its own image set
  window.openLightboxWith = function(imgs, startIdx) {
    currentImages = imgs;
    currentIndex  = startIdx || 0;
    openLightbox(currentIndex);
  };
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

// --- Accessibility Widget ---
(function () {
  const btn   = document.getElementById('a11yBtn');
  const panel = document.getElementById('a11yPanel');
  if (!btn || !panel) return;

  const CLS = {
    big:      'a11y-big-text',
    bigger:   'a11y-bigger-text',
    contrast: 'a11y-high-contrast',
    font:     'a11y-readable-font',
    links:    'a11y-highlight-links'
  };

  let textLevel = 0; // 0=normal 1=big 2=bigger

  function applyText() {
    document.body.classList.remove(CLS.big, CLS.bigger);
    if (textLevel === 1) document.body.classList.add(CLS.big);
    if (textLevel === 2) document.body.classList.add(CLS.bigger);
  }

  function save() {
    localStorage.setItem('a11y', JSON.stringify({
      textLevel,
      contrast : document.body.classList.contains(CLS.contrast),
      font     : document.body.classList.contains(CLS.font),
      links    : document.body.classList.contains(CLS.links)
    }));
  }

  function updateUI() {
    const b = document.body;
    const $ = id => document.getElementById(id);
    $('a11yTPlus') .classList.toggle('a11y-active', textLevel >= 1);
    $('a11yTMinus').classList.toggle('a11y-active', textLevel >= 1);
    $('a11yContrast').textContent = b.classList.contains(CLS.contrast) ? 'כבה' : 'הפעל';
    $('a11yContrast').classList.toggle('a11y-active', b.classList.contains(CLS.contrast));
    $('a11yFont')    .textContent = b.classList.contains(CLS.font)     ? 'כבה' : 'הפעל';
    $('a11yFont')    .classList.toggle('a11y-active', b.classList.contains(CLS.font));
    $('a11yLinks')   .textContent = b.classList.contains(CLS.links)    ? 'כבה' : 'הפעל';
    $('a11yLinks')   .classList.toggle('a11y-active', b.classList.contains(CLS.links));
  }

  // Load saved settings
  try {
    const s = JSON.parse(localStorage.getItem('a11y') || '{}');
    textLevel = s.textLevel || 0;
    applyText();
    if (s.contrast) document.body.classList.add(CLS.contrast);
    if (s.font)     document.body.classList.add(CLS.font);
    if (s.links)    document.body.classList.add(CLS.links);
  } catch(e) {}
  updateUI();

  // Toggle panel
  btn.addEventListener('click', e => {
    e.stopPropagation();
    panel.classList.toggle('open');
  });
  document.addEventListener('click', e => {
    if (!panel.contains(e.target) && e.target !== btn)
      panel.classList.remove('open');
  });

  document.getElementById('a11yTPlus').addEventListener('click', () => {
    textLevel = Math.min(textLevel + 1, 2);
    applyText(); save(); updateUI();
  });
  document.getElementById('a11yTMinus').addEventListener('click', () => {
    textLevel = Math.max(textLevel - 1, 0);
    applyText(); save(); updateUI();
  });
  document.getElementById('a11yContrast').addEventListener('click', () => {
    document.body.classList.toggle(CLS.contrast); save(); updateUI();
  });
  document.getElementById('a11yFont').addEventListener('click', () => {
    document.body.classList.toggle(CLS.font); save(); updateUI();
  });
  document.getElementById('a11yLinks').addEventListener('click', () => {
    document.body.classList.toggle(CLS.links); save(); updateUI();
  });
  document.getElementById('a11yReset').addEventListener('click', () => {
    textLevel = 0;
    applyText();
    document.body.classList.remove(...Object.values(CLS));
    localStorage.removeItem('a11y');
    updateUI();
  });
})();
