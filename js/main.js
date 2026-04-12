/* ---- SPA Navigation ---- */
function navigate(page) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  // Show target
  const target = document.getElementById('page-' + page);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  // Update nav active states
  document.querySelectorAll('.main-nav a').forEach(a => {
    a.classList.toggle('active', a.dataset.page === page);
  });
  // Close mobile nav
  document.getElementById('main-nav').classList.remove('open');
  // Trigger reveal for new page
  setTimeout(initReveal, 50);
  return false;
}

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

/* ---- Contact form mock submit ---- */
function handleFormSubmit(e) {
  e.preventDefault();
  const btn = e.target;
  btn.textContent = 'Sending...';
  btn.disabled = true;
  setTimeout(() => {
    document.getElementById('form-success').style.display = 'block';
    btn.textContent = 'Message Sent';
    btn.style.background = 'var(--green-soft)';
    btn.style.borderColor = 'var(--green-soft)';
  }, 1200);
}

/* ---- Hero Slideshow with Ken Burns ---- */
(function initHeroSlideshow() {
  const slides   = Array.from(document.querySelectorAll('.hero-slide'));
  const dots     = Array.from(document.querySelectorAll('.hero-dot'));
  if (!slides.length) return;

  let current  = 0;
  let timer    = null;
  const DURATION = 5800; // ms per slide

  function goTo(index) {
    slides[current].classList.remove('hero-slide--active');
    if (dots[current]) dots[current].classList.remove('hero-dot--active');

    current = (index + slides.length) % slides.length;

    // Restart Ken Burns by forcing a reflow
    const img = slides[current].querySelector('img');
    img.style.animation = 'none';
    void img.offsetWidth;
    img.style.animation = '';

    slides[current].classList.add('hero-slide--active');
    if (dots[current]) dots[current].classList.add('hero-dot--active');
  }

  function next() { goTo(current + 1); }

  function startTimer() {
    clearInterval(timer);
    timer = setInterval(next, DURATION);
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goTo(i); startTimer(); });
  });

  // Pause on hover, resume on leave
  const hero = document.querySelector('.hero');
  if (hero) {
    hero.addEventListener('mouseenter', () => clearInterval(timer));
    hero.addEventListener('mouseleave', startTimer);
  }

  startTimer();
})();

/* ---- Init on load ---- */
window.addEventListener('DOMContentLoaded', () => {
  initReveal();

  // Reveal above-fold hero items immediately
  setTimeout(() => {
    document.querySelectorAll('#page-home .hero .reveal').forEach(el => {
      el.classList.add('visible');
    });
  }, 100);
});
