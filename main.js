/* ================================================================
   TSATSense — Main JavaScript
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollReveal();
  initIndustryTabs();
  initModal();
  initMobileNav();
  initIsometricIllustration();
  initLoginModal();
});

/* ----------------------------------------------------------------
   NAVBAR — shrink on scroll
   ---------------------------------------------------------------- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

/* ----------------------------------------------------------------
   SCROLL REVEAL — fade-up elements as they enter viewport
   ---------------------------------------------------------------- */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  reveals.forEach(el => observer.observe(el));
}

/* ----------------------------------------------------------------
   INDUSTRY TABS — switch active panel
   ---------------------------------------------------------------- */
function initIndustryTabs() {
  const tabs = document.querySelectorAll('.ind-tab');
  const panels = document.querySelectorAll('.industry-panel');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetPanel = document.getElementById('panel-' + tab.dataset.panel);
      if (targetPanel) targetPanel.classList.add('active');
    });
  });
}

/* ----------------------------------------------------------------
   CONTACT MODAL
   ---------------------------------------------------------------- */
function initModal() {
  const overlay = document.getElementById('contactModal');
  if (!overlay) return;

  // Click outside to close
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  // Escape key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

function openModal() {
  const overlay = document.getElementById('contactModal');
  if (!overlay) return;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const overlay = document.getElementById('contactModal');
  if (!overlay) return;
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

function submitForm() {
  // TODO: Replace with actual form submission (fetch API / backend)
  alert('Terima kasih! Tim kami akan segera menghubungi Anda.');
  closeModal();
}

/* ----------------------------------------------------------------
   MOBILE NAVIGATION — full-screen overlay
   ---------------------------------------------------------------- */
function initMobileNav() {
  // Close links inside mobile nav
  const mobileNav = document.getElementById('mobileNav');
  if (!mobileNav) return;

  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => closeMobileNav());
  });
}

function openMobileNav() {
  const nav = document.getElementById('mobileNav');
  if (!nav) return;
  nav.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeMobileNav() {
  const nav = document.getElementById('mobileNav');
  if (!nav) return;
  nav.classList.remove('open');
  document.body.style.overflow = '';
}

/* ----------------------------------------------------------------
   ISOMETRIC ILLUSTRATION — draw connection lines & data pulses
   ---------------------------------------------------------------- */
function initIsometricIllustration() {
  // Small delay to let layout settle
  setTimeout(drawConnections, 300);

  // Redraw on resize (debounced)
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(drawConnections, 150);
  });
}

function drawConnections() {
  const container = document.getElementById('isoIllustration');
  const svg = document.getElementById('isoLines');
  if (!container || !svg) return;

  const rect = container.getBoundingClientRect();
  const w = rect.width;
  const h = rect.height;
  const cx = w / 2;
  const cy = h / 2;

  // Clear & resize viewBox
  svg.innerHTML = '';
  svg.setAttribute('viewBox', `0 0 ${w} ${h}`);

  // SVG filter for glow effect
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  defs.innerHTML = `
    <filter id="pulseGlow">
      <feGaussianBlur stdDeviation="2" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  `;
  svg.appendChild(defs);

  // Draw lines from each node to center hub
  const nodes = container.querySelectorAll('.iso-node');

  nodes.forEach((node) => {
    const nr = node.getBoundingClientRect();
    const nx = nr.left - rect.left + nr.width / 2;
    const ny = nr.top - rect.top + nr.height / 2;

    // Dashed connection line
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', nx);
    line.setAttribute('y1', ny);
    line.setAttribute('x2', cx);
    line.setAttribute('y2', cy);
    svg.appendChild(line);

    // Subtle glow line underneath
    const glow = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    glow.classList.add('line-glow');
    glow.setAttribute('x1', nx);
    glow.setAttribute('y1', ny);
    glow.setAttribute('x2', cx);
    glow.setAttribute('y2', cy);
    glow.setAttribute('opacity', '0.08');
    svg.appendChild(glow);

    // Animated data-pulse dot traveling along line
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('r', '3');
    circle.setAttribute('fill', '#00e5a0');
    circle.setAttribute('filter', 'url(#pulseGlow)');

    const dur = 3 + Math.random() * 3;    // 3–6s round trip
    const delay = Math.random() * 4;      // stagger start

    // cx animation
    const animCX = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
    animCX.setAttribute('attributeName', 'cx');
    animCX.setAttribute('values', `${nx};${cx};${nx}`);
    animCX.setAttribute('dur', `${dur}s`);
    animCX.setAttribute('begin', `${delay}s`);
    animCX.setAttribute('repeatCount', 'indefinite');

    // cy animation
    const animCY = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
    animCY.setAttribute('attributeName', 'cy');
    animCY.setAttribute('values', `${ny};${cy};${ny}`);
    animCY.setAttribute('dur', `${dur}s`);
    animCY.setAttribute('begin', `${delay}s`);
    animCY.setAttribute('repeatCount', 'indefinite');

    // opacity animation (fade in/out)
    const animOP = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
    animOP.setAttribute('attributeName', 'opacity');
    animOP.setAttribute('values', '0;0.9;0.9;0');
    animOP.setAttribute('keyTimes', '0;0.1;0.9;1');
    animOP.setAttribute('dur', `${dur}s`);
    animOP.setAttribute('begin', `${delay}s`);
    animOP.setAttribute('repeatCount', 'indefinite');

    circle.appendChild(animCX);
    circle.appendChild(animCY);
    circle.appendChild(animOP);
    svg.appendChild(circle);
  });
}

/* ----------------------------------------------------------------
   LOGIN MODAL
   ---------------------------------------------------------------- */
function initLoginModal() {
  const overlay = document.getElementById('loginModal');
  if (!overlay) return;

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeLoginModal();
  });

  document.getElementById('login-password').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') submitLoginForm();
  });
}

function openLoginModal() {
  const overlay = document.getElementById('loginModal');
  if (!overlay) return;
  document.getElementById('login-error').style.display = 'none';
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  setTimeout(() => document.getElementById('login-username').focus(), 100);
}

function closeLoginModal() {
  const overlay = document.getElementById('loginModal');
  if (!overlay) return;
  overlay.classList.remove('open');
  document.body.style.overflow = '';
  document.getElementById('login-username').value = '';
  document.getElementById('login-password').value = '';
  document.getElementById('login-error').style.display = 'none';
}

function submitLoginForm() {
  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value;
  const errorEl = document.getElementById('login-error');

  if (username === 'superadmin' && password === '12345') {
    errorEl.style.display = 'none';
    closeLoginModal();
    window.location.href = 'platform.html';
  } else {
    errorEl.style.display = 'block';
    document.getElementById('login-password').value = '';
    document.getElementById('login-password').focus();
  }
}

/* ----------------------------------------------------------------
   SMOOTH SCROLL HELPER — used by inline onclick buttons
   ---------------------------------------------------------------- */
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}
