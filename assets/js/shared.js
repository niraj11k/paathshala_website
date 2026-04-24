/* shared.js — injects nav and footer into every page */

function paathshalaEnsureSiteRoot() {
  if (typeof window === 'undefined') return '';
  if (typeof window.__PAATHSHALA_SITE_ROOT__ === 'string' && window.__PAATHSHALA_SITE_ROOT__) {
    var existing = window.__PAATHSHALA_SITE_ROOT__;
    return /\/$/.test(existing) ? existing : existing + '/';
  }
  var u = new URL(window.location.href);
  var p = u.pathname.split('/').filter(Boolean);
  if (p.length && /\.html?$/i.test(p[p.length - 1])) {
    p.pop();
  }
  if (p.length) {
    p.pop();
  }
  u.pathname = '/' + (p.length ? p.join('/') + '/' : '');
  var href = u.href;
  if (!/\/$/.test(href)) {
    href += '/';
  }
  window.__PAATHSHALA_SITE_ROOT__ = href;
  return href;
}

function paathshalaResolveUrl(path) {
  if (!path || path.charAt(0) === '#' || /^(?:https?:|mailto:|tel:)/i.test(path)) {
    return path;
  }
  var root = paathshalaEnsureSiteRoot();
  if (!root) return path;
  try {
    return new URL(String(path).replace(/^\//, ''), root).href;
  } catch (e) {
    return root + String(path).replace(/^\//, '');
  }
}

function initRootHrefLinks() {
  var root = paathshalaEnsureSiteRoot();
  if (!root) return;
  document.querySelectorAll('a[data-root-href]').forEach(function (a) {
    var rel = a.getAttribute('data-root-href');
    if (!rel) return;
    try {
      a.setAttribute('href', new URL(rel, root).href);
    } catch (e) {
      a.setAttribute('href', root + rel.replace(/^\//, ''));
    }
    a.removeAttribute('data-root-href');
  });
}

function getNavHTML(activePage) {
  const pages = [
    { href: 'index.html',              label: 'Home' },
    { href: 'about/about.html',        label: 'About Us' },
    { href: 'programs/programs.html',  label: 'Programs' },
    { href: 'members/members.html',    label: 'Members' },
    { href: 'landing/landing.html',    label: 'Enrol' },
    { href: 'contact/contact.html',    label: 'Contact Us' },
  ];

  const links = pages.map(p => `
    <li><a href="${paathshalaResolveUrl(p.href)}" ${p.label === activePage ? 'class="active" aria-current="page"' : ''}>${p.label}</a></li>
  `).join('');

  const mobileLinks = pages.map(p => `
    <a href="${paathshalaResolveUrl(p.href)}" ${p.label === activePage ? 'style="color:var(--red);font-weight:600;"' : ''}>${p.label}</a>
  `).join('');

  return `
    <a class="skip-link" href="#main-content">Skip to main content</a>

    <div class="top-bar" role="banner">
      <div class="top-bar-left">
        <span>📞 <a href="tel:02102697038">02102697038</a></span>
        <span>📞 <a href="tel:0212427980">021 242 7980</a></span>
      </div>
      <span>📧 <a href="mailto:info@paathshalanavoday.co.nz">info@paathshalanavoday.co.nz</a></span>
    </div>

    <nav class="navbar" role="navigation" aria-label="Main navigation">
      <div class="nav-inner">
        <a href="${paathshalaResolveUrl('index.html')}" class="nav-logo" aria-label="Paathshala Navoday home">
          <div class="logo-emblem">
            <img src="${paathshalaResolveUrl('assets/images/logo-paathshala.png')}" alt="Paathshala Navoday logo">
          </div>
          <div class="logo-text">
            <strong>Paathshala Navoday</strong>
            <span>Indian School of Art, Culture &amp; Language</span>
          </div>
        </a>
        <ul class="nav-links" role="list">
          ${links}
          <li><a href="${paathshalaResolveUrl('contact/contact.html')}" class="nav-cta">Enrol Now</a></li>
        </ul>
        <button class="hamburger" onclick="window.toggleMobile()" type="button" aria-label="Toggle navigation" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
      </div>
      <div class="mobile-nav" id="mobile-nav">
        ${mobileLinks}
        <a href="${paathshalaResolveUrl('contact/contact.html')}" style="color:var(--red);font-weight:600;">Enrol Now →</a>
      </div>
    </nav>
  `;
}

function getFooterHTML() {
  return `
    <div class="enroll-banner" role="region" aria-label="Enrollment call to action">
      <h2>Enrollment Open for All Ages</h2>
      <p>Don't miss this term's intake — spaces are limited. Register today and secure your place.</p>
      <div class="enroll-actions">
        <a href="${paathshalaResolveUrl('contact/contact.html')}" class="btn-white">Register Now</a>
        <a href="tel:02102697038" class="btn-outline" style="color:#fff;border-color:rgba(255,255,255,0.7);">Call Us</a>
      </div>
    </div>

    <footer role="contentinfo">
      <div class="footer-grid">
        <div class="footer-brand">
          <div class="footer-logo">
            <img class="footer-logo-img" src="${paathshalaResolveUrl('assets/images/logo-paathshala.png')}" alt="" width="518" height="466" decoding="async">
            <div class="footer-logo-text">
              <strong>Paathshala Navoday</strong>
              <span>Indian School of Art, Culture &amp; Language</span>
            </div>
          </div>
          <p>Igniting young minds with language, creativity and tradition. Serving the Wellington Indian community with heart.</p>
          <div class="social-links" aria-label="Social media links">
            <a href="#" class="social-link" aria-label="Facebook">f</a>
            <a href="#" class="social-link" aria-label="Instagram">in</a>
            <a href="#" class="social-link" aria-label="WhatsApp">W</a>
          </div>
        </div>
        <div class="footer-col">
          <h4>Programs</h4>
          <ul role="list">
            <li><a href="${paathshalaResolveUrl('programs/programs.html#hindi')}">Hindi Language</a></li>
            <li><a href="${paathshalaResolveUrl('programs/programs.html#art')}">Art &amp; Drawing</a></li>
            <li><a href="${paathshalaResolveUrl('programs/programs.html#drama')}">Drama &amp; Stage</a></li>
            <li><a href="${paathshalaResolveUrl('programs/programs.html#culture')}">Cultural Awareness</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Quick Links</h4>
          <ul role="list">
            <li><a href="${paathshalaResolveUrl('index.html')}">Home</a></li>
            <li><a href="${paathshalaResolveUrl('about/about.html')}">About Us</a></li>
            <li><a href="${paathshalaResolveUrl('members/members.html')}">Members</a></li>
            <li><a href="${paathshalaResolveUrl('contact/contact.html')}">Contact Us</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Get in Touch</h4>
          <address>
            Hanuman Temple Mandir<br>
            15 Ferguson Street<br>
            Newtown, Wellington<br><br>
            <a href="tel:02102697038" style="color:rgba(255,255,255,0.6)">02102697038</a><br>
            <a href="tel:0212427980" style="color:rgba(255,255,255,0.6)">021 242 7980</a>
          </address>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© 2026 Paathshala Navoday. All rights reserved.</span>
        <span><a href="${paathshalaResolveUrl('contact/contact.html?topic=privacy')}" title="Contact us about privacy">Privacy Policy</a> · <a href="${paathshalaResolveUrl('contact/contact.html?topic=terms')}" title="Contact us about terms of use">Terms of Use</a></span>
      </div>
    </footer>
  `;
}

window.toggleMobile = function toggleMobile() {
  const nav = document.getElementById('mobile-nav');
  const btn = document.querySelector('.hamburger');
  if (!nav) return;
  nav.classList.toggle('open');
  const isOpen = nav.classList.contains('open');
  if (btn) btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
};

function initHeroCarousel() {
  const track = document.getElementById('hero-carousel-track');
  if (!track || track.getAttribute('data-carousel-init') === '1') return;
  track.setAttribute('data-carousel-init', '1');

  const slides = Array.from(track.querySelectorAll('.carousel-slide'));
  const dots = Array.from(document.querySelectorAll('.carousel-dots .dot'));
  const prevBtn = document.querySelector('.carousel-btn.prev');
  const nextBtn = document.querySelector('.carousel-btn.next');
  if (slides.length <= 1) {
    if (prevBtn) prevBtn.hidden = true;
    if (nextBtn) nextBtn.hidden = true;
    return;
  }

  let index = 0;
  let timer;

  function showSlide(nextIndex) {
    slides[index].classList.remove('active');
    if (dots[index]) dots[index].classList.remove('active');
    index = (nextIndex + slides.length) % slides.length;
    slides[index].classList.add('active');
    if (dots[index]) dots[index].classList.add('active');
  }

  function autoplay() {
    timer = window.setInterval(function () {
      showSlide(index + 1);
    }, 5000);
  }

  function resetAutoplay() {
    window.clearInterval(timer);
    autoplay();
  }

  if (prevBtn) prevBtn.addEventListener('click', function () { showSlide(index - 1); resetAutoplay(); });
  if (nextBtn) nextBtn.addEventListener('click', function () { showSlide(index + 1); resetAutoplay(); });
  dots.forEach(function (dot, dotIndex) {
    dot.addEventListener('click', function () {
      showSlide(dotIndex);
      resetAutoplay();
    });
  });

  autoplay();
}

function paathshalaBoot() {
  initRootHrefLinks();
  const page = document.body.dataset.page;
  const navPh = document.getElementById('nav-placeholder');
  const footPh = document.getElementById('footer-placeholder');
  if (navPh) navPh.innerHTML = getNavHTML(page);
  if (footPh) footPh.innerHTML = getFooterHTML();
  initHeroCarousel();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', paathshalaBoot);
} else {
  paathshalaBoot();
}
