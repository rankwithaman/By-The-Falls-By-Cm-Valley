/* ============================================================
   BY THE FALLS BY CM VALLEY — Main JavaScript
   ============================================================ */

/* ── Loading Screen ── */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
  }, 1200);
});

/* ── Navbar Scroll ── */
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });
}

/* ── Active Nav Link ── */
(function setActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (href === path || (path === '' && href === 'index.html') ||
        (path === 'index.html' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();

/* ── Mobile Nav ── */
const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav');
if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open');
    document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
  });
  mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ── Scroll-to-Top ── */
const scrollTopBtn = document.getElementById('scrollTop');
if (scrollTopBtn) {
  window.addEventListener('scroll', () => {
    scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
  });
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ── Scroll Reveal ── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      // stagger children if .stagger-children
      if (e.target.classList.contains('stagger-parent')) {
        e.target.querySelectorAll('.stagger-child').forEach((el, i) => {
          el.style.transitionDelay = (i * 0.12) + 's';
          el.classList.add('visible');
        });
      }
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});

/* ── Animated Counters ── */
function animateCounter(el) {
  const target = parseInt(el.dataset.target || el.textContent, 10);
  const duration = 1600;
  const step = target / (duration / 16);
  let current = 0;
  const suffix = el.dataset.suffix || '';
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current) + suffix;
  }, 16);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting && !e.target.classList.contains('counted')) {
      e.target.classList.add('counted');
      animateCounter(e.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.counter-num').forEach(el => {
  el.dataset.target = el.textContent.replace(/\D/g, '');
  counterObserver.observe(el);
});

/* ── Testimonial Slider ── */
(function initTestiSlider() {
  const slider = document.querySelector('.testi-slider');
  const dots   = document.querySelectorAll('.testi-dot');
  if (!slider || !dots.length) return;

  const cards = slider.querySelectorAll('.testi-card');
  let current = 0;
  let perView = window.innerWidth > 900 ? 3 : window.innerWidth > 600 ? 2 : 1;

  function getCardWidth() {
    if (!cards[0]) return 0;
    return cards[0].offsetWidth + 30;
  }

  function goTo(idx) {
    const max = Math.max(0, cards.length - perView);
    current = Math.max(0, Math.min(idx, max));
    slider.style.transform = `translateX(-${current * getCardWidth()}px)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));

  let autoPlay = setInterval(() => {
    const max = Math.max(0, cards.length - perView);
    goTo(current < max ? current + 1 : 0);
  }, 4500);

  slider.parentElement?.addEventListener('mouseenter', () => clearInterval(autoPlay));
  slider.parentElement?.addEventListener('mouseleave', () => {
    autoPlay = setInterval(() => {
      const max = Math.max(0, cards.length - perView);
      goTo(current < max ? current + 1 : 0);
    }, 4500);
  });

  window.addEventListener('resize', () => {
    perView = window.innerWidth > 900 ? 3 : window.innerWidth > 600 ? 2 : 1;
    goTo(0);
  });
})();

/* ── Menu Tabs ── */
(function initMenuTabs() {
  const tabs  = document.querySelectorAll('.tab-btn');
  const items = document.querySelectorAll('.menu-item');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const cat = tab.dataset.cat;
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      items.forEach(item => {
        const show = cat === 'all' || item.dataset.cat === cat;
        item.classList.toggle('active', show);
      });
    });
  });
  // init first tab
  if (tabs[0]) tabs[0].click();
})();

/* ── Gallery Filter & Lightbox ── */
(function initGallery() {
  // Filter
  const filterBtns = document.querySelectorAll('.gallery-filter .tab-btn');
  const items = document.querySelectorAll('.masonry-item');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.cat;
      items.forEach(item => {
        const show = cat === 'all' || item.dataset.cat === cat;
        item.style.display = show ? 'block' : 'none';
      });
    });
  });
  if (filterBtns[0]) filterBtns[0].click();

  // Lightbox
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;
  const lbImg   = lightbox.querySelector('img');
  const lbClose = lightbox.querySelector('.lb-close');
  const lbPrev  = lightbox.querySelector('.lb-arrow.prev');
  const lbNext  = lightbox.querySelector('.lb-arrow.next');
  let allImgs = [], lbIndex = 0;

  function openLb(src, index, imgs) {
    allImgs = imgs;
    lbIndex = index;
    lbImg.src = src;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLb() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }
  function showLb(idx) {
    lbIndex = (idx + allImgs.length) % allImgs.length;
    lbImg.src = allImgs[lbIndex];
  }

  items.forEach((item, i) => {
    item.addEventListener('click', () => {
      const imgs = [...items].filter(it => it.style.display !== 'none').map(it => it.querySelector('img').src);
      const idx  = imgs.indexOf(item.querySelector('img').src);
      openLb(item.querySelector('img').src, Math.max(0, idx), imgs);
    });
  });
  if (lbClose) lbClose.addEventListener('click', closeLb);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLb(); });
  if (lbPrev) lbPrev.addEventListener('click', () => showLb(lbIndex - 1));
  if (lbNext) lbNext.addEventListener('click', () => showLb(lbIndex + 1));
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') showLb(lbIndex - 1);
    if (e.key === 'ArrowRight') showLb(lbIndex + 1);
  });
})();

/* ── Contact Form ── */
(function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    const original = btn.innerHTML;
    btn.innerHTML = '<span>Message Sent! ✓</span>';
    btn.style.background = '#4CAF50';
    setTimeout(() => {
      btn.innerHTML = original;
      btn.style.background = '';
      form.reset();
    }, 3000);
  });
})();

/* ── Reservation Form ── */
(function initResForm() {
  const form = document.getElementById('resForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('.res-btn');
    const original = btn.textContent;
    btn.textContent = 'Table Reserved! ✓';
    btn.style.background = '#4CAF50';
    setTimeout(() => {
      btn.textContent = original;
      btn.style.background = '';
      form.reset();
    }, 3000);
  });
})();

/* ── Parallax on hero-bg ── */
(function initParallax() {
  const heroBg = document.querySelector('.hero-bg');
  if (!heroBg) return;
  window.addEventListener('scroll', () => {
    const y = window.scrollY * 0.35;
    heroBg.style.transform = `scale(1.08) translateY(${y}px)`;
  }, { passive: true });
})();

/* ── Page Transitions ── */
document.querySelectorAll('a[href]').forEach(link => {
  const href = link.getAttribute('href');
  if (!href || href.startsWith('#') || href.startsWith('tel:') ||
      href.startsWith('mailto:') || href.startsWith('http') ||
      link.target === '_blank') return;

  link.addEventListener('click', e => {
    e.preventDefault();
    const overlay = document.querySelector('.page-transition');
    if (overlay) {
      overlay.classList.add('active');
      setTimeout(() => { window.location.href = href; }, 350);
    } else {
      window.location.href = href;
    }
  });
});

/* ── Smooth Anchor Scroll ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ── Image Lazy Load ── */
if ('IntersectionObserver' in window) {
  const imgObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const img = e.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        imgObserver.unobserve(img);
      }
    });
  }, { rootMargin: '200px' });

  document.querySelectorAll('img[data-src]').forEach(img => imgObserver.observe(img));
}

/* ── Mini toast notification ── */
function showToast(msg, color = '#c9a84c') {
  const toast = document.createElement('div');
  toast.textContent = msg;
  Object.assign(toast.style, {
    position: 'fixed', bottom: '80px', left: '50%',
    transform: 'translateX(-50%) translateY(20px)',
    background: color, color: '#0a0a0a',
    padding: '12px 28px', borderRadius: '30px',
    fontFamily: "'Jost', sans-serif", fontSize: '0.8rem',
    fontWeight: '500', letterSpacing: '0.12em',
    zIndex: '9999', opacity: '0',
    transition: 'all 0.4s ease', boxShadow: '0 8px 30px rgba(0,0,0,0.4)'
  });
  document.body.appendChild(toast);
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 400);
  }, 2800);
}
