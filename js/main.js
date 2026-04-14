/* ---- SPA Navigation ---- */

// Internal: show a page without touching history
function showPage(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('page-' + page);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  document.querySelectorAll('.main-nav a').forEach(a => {
    a.classList.toggle('active', a.dataset.page === page);
  });
  document.getElementById('main-nav').classList.remove('open');
  setTimeout(initReveal, 50);
}

// Public: navigate + update URL hash for shareable/bookmarkable links
function navigate(page) {
  showPage(page);
  const hash = page === 'home' ? '' : '#' + page;
  history.pushState({ page: page }, '', window.location.pathname + hash);
  return false;
}

// Handle browser back / forward buttons
window.addEventListener('popstate', function(e) {
  const page = (e.state && e.state.page) ? e.state.page : 'home';
  showPage(page);
});

/* ---- Mobile nav toggle ---- */
document.getElementById('nav-toggle').addEventListener('click', function() {
  document.getElementById('main-nav').classList.toggle('open');
});

/* ---- Sticky header shadow ---- */
window.addEventListener('scroll', function() {
  const header = document.getElementById('site-header');
  header.classList.toggle('scrolled', window.scrollY > 10);
});

/* ---- Scroll Reveal ---- */
function initReveal() {
  const reveals = document.querySelectorAll('.page.active .reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => {
    if (!el.classList.contains('visible')) {
      observer.observe(el);
    }
  });
}

/* ---- Contact form — Formspree ---- */
// TODO: Sign up at https://formspree.io (free), create a form, and replace
// REPLACE_WITH_YOUR_FORM_ID below with your actual form ID (looks like "xabcdefg").
const FORMSPREE_ID = 'REPLACE_WITH_YOUR_FORM_ID';

function handleFormSubmit(e) {
  e.preventDefault();
  const form = document.getElementById('contact-form');
  const btn = form.querySelector('button[type="submit"]');

  btn.textContent = 'Sending...';
  btn.disabled = true;

  fetch('https://formspree.io/f/' + FORMSPREE_ID, {
    method: 'POST',
    body: new FormData(form),
    headers: { 'Accept': 'application/json' }
  })
  .then(r => r.json())
  .then(data => {
    if (data.ok) {
      document.getElementById('form-success').style.display = 'block';
      btn.textContent = 'Message Sent';
      btn.style.background = 'var(--green-soft)';
      btn.style.borderColor = 'var(--green-soft)';
      form.reset();
    } else {
      btn.textContent = 'Something went wrong — try again';
      btn.disabled = false;
    }
  })
  .catch(() => {
    btn.textContent = 'Something went wrong — try again';
    btn.disabled = false;
  });
}

/* ---- Gallery Lightbox ---- */
let lbImages = [];
let lbIndex  = 0;

function openLightbox(imgEl) {
  lbImages = Array.from(document.querySelectorAll('#page-gallery .gallery-item img'));
  lbIndex  = lbImages.indexOf(imgEl);
  if (lbIndex === -1) lbIndex = 0;
  setLightboxImage(lbIndex);
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}

function setLightboxImage(i) {
  const img     = lbImages[i];
  const caption = img.closest('.gallery-item').querySelector('.gallery-caption');
  document.getElementById('lightbox-img').src = img.src;
  document.getElementById('lightbox-img').alt = img.alt;
  document.getElementById('lightbox-caption').textContent = caption ? caption.textContent.trim() : '';
}

function lbPrev() {
  lbIndex = (lbIndex - 1 + lbImages.length) % lbImages.length;
  setLightboxImage(lbIndex);
}

function lbNext() {
  lbIndex = (lbIndex + 1) % lbImages.length;
  setLightboxImage(lbIndex);
}

/* ---- Hero Slideshow with Ken Burns ---- */
function initHeroSlideshow() {
  const slides = Array.from(document.querySelectorAll('.hero-slide'));
  const dots   = Array.from(document.querySelectorAll('.hero-dot'));
  if (!slides.length) return;

  let current = 0;
  const DURATION = 5800;

  function goTo(index) {
    slides[current].classList.remove('hero-slide--active');
    if (dots[current]) dots[current].classList.remove('hero-dot--active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('hero-slide--active');
    if (dots[current]) dots[current].classList.add('hero-dot--active');
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goTo(i); });
  });

  setInterval(() => goTo(current + 1), DURATION);
}

/* ---- Init on load ---- */
window.addEventListener('DOMContentLoaded', () => {
  // Check URL hash for deep links (e.g. yoursite.com/#svc-pergolas)
  const hash = window.location.hash.slice(1);
  const initialPage = hash || 'home';
  showPage(initialPage);
  history.replaceState({ page: initialPage }, '', window.location.href);

  initReveal();
  initHeroSlideshow();

  // Reveal above-fold hero items immediately
  setTimeout(() => {
    document.querySelectorAll('#page-home .hero .reveal').forEach(el => {
      el.classList.add('visible');
    });
  }, 100);

  // Lightbox controls
  document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
  document.getElementById('lightbox-bg').addEventListener('click', closeLightbox);
  document.getElementById('lightbox-prev').addEventListener('click', lbPrev);
  document.getElementById('lightbox-next').addEventListener('click', lbNext);

  // Open lightbox when clicking any gallery item (event delegation)
  document.addEventListener('click', function(e) {
    const item = e.target.closest('#page-gallery .gallery-item');
    if (item) {
      const img = item.querySelector('img');
      if (img) openLightbox(img);
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', function(e) {
    if (!document.getElementById('lightbox').classList.contains('open')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  lbPrev();
    if (e.key === 'ArrowRight') lbNext();
  });
});
