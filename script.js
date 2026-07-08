/* ---------- Mobile nav ---------- */
const toggle = document.getElementById('menuToggle');
const mobileNav = document.getElementById('mobileNav');
const navClose = document.getElementById('navClose');

toggle.addEventListener('click', () => {
  const isOpen = document.body.classList.toggle('nav-open');
  toggle.setAttribute('aria-expanded', isOpen);
});

navClose.addEventListener('click', () => {
  document.body.classList.remove('nav-open');
  toggle.setAttribute('aria-expanded', 'false');
});

mobileNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    document.body.classList.remove('nav-open');
    toggle.setAttribute('aria-expanded', 'false');
  });
});

/* ---------- Dropdowns (disclosure pattern) ----------
   Click toggles (works for touch + keyboard). On desktop widths,
   hover also opens for convenience. Escape closes and returns focus;
   clicking outside closes. */
const dropdowns = document.querySelectorAll('[data-dropdown]');
const desktopQuery = window.matchMedia('(min-width: 900px)');

function setDropdown(dd, open) {
  dd.classList.toggle('open', open);
  const btn = dd.querySelector('.dropdown-toggle');
  if (btn) btn.setAttribute('aria-expanded', String(open));
}

dropdowns.forEach(dd => {
  const btn = dd.querySelector('.dropdown-toggle');
  if (!btn) return;

  btn.addEventListener('click', () => {
    setDropdown(dd, !dd.classList.contains('open'));
  });

  dd.addEventListener('mouseenter', () => {
    if (desktopQuery.matches) setDropdown(dd, true);
  });
  dd.addEventListener('mouseleave', () => {
    if (desktopQuery.matches) setDropdown(dd, false);
  });

  dd.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && dd.classList.contains('open')) {
      setDropdown(dd, false);
      btn.focus();
    }
  });
});

document.addEventListener('click', (e) => {
  dropdowns.forEach(dd => {
    if (dd.classList.contains('open') && !dd.contains(e.target)) {
      setDropdown(dd, false);
    }
  });
});

/* ---------- Scroll reveals ---------- */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealEls = document.querySelectorAll('.reveal');

if (reduceMotion) {
  revealEls.forEach(el => el.classList.add('is-visible'));
} else {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));
}
