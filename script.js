/* ── Google dataLayer helper ────────────────────────────────────────────── */
window.dataLayer = window.dataLayer || [];

/* ── Mobile nav toggle ─────────────────────────────────────────────────── */
const menuButton = document.querySelector('.menu-toggle');
const mobileNav  = document.querySelector('.mobile-nav');

if (menuButton && mobileNav) {
  menuButton.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('is-open');
    mobileNav.hidden = !isOpen;
    menuButton.setAttribute('aria-expanded', String(isOpen));
  });

  mobileNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('is-open');
      mobileNav.hidden = true;
      menuButton.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ── Sticky header darkens on scroll ────────────────────────────────────── */
const header = document.querySelector('.site-header');
if (header) {
  window.addEventListener('scroll', () => {
    header.style.background = window.scrollY > 20
      ? 'rgba(8, 17, 31, 0.97)'
      : 'rgba(8, 17, 31, 0.88)';
  }, { passive: true });
}

/* ── CTA click tracking → GA4 via dataLayer ─────────────────────────────
   Fires a 'cta_click' event for every link pointing to the register URL.
   GTM picks this up and forwards it to GA4 as a custom event.
   ────────────────────────────────────────────────────────────────────── */
const REGISTER_URL = 'sinqops.store/peakliferx/register';

document.querySelectorAll('a[href*="' + REGISTER_URL + '"]').forEach((link) => {
  link.addEventListener('click', () => {
    const label = (link.textContent || '').trim().substring(0, 60);
    const location = link.closest('header')   ? 'header'
                   : link.closest('.hero')    ? 'hero'
                   : link.closest('.trust-strip') ? 'trust_strip'
                   : link.closest('#how')     ? 'how_it_works'
                   : link.closest('#audiences') ? 'audiences'
                   : link.closest('.split-section') ? 'platform_split'
                   : link.closest('.get-access-section') ? 'get_access_cta'
                   : link.closest('.announcement-bar') ? 'announcement_bar'
                   : link.closest('.site-footer') ? 'footer'
                   : 'other';

    window.dataLayer.push({
      event: 'cta_click',
      cta_label: label,
      cta_location: location,
      cta_destination: link.href
    });
  });
});

/* ── Partner form submission tracking ───────────────────────────────────
   Fires 'form_submit' on the visible partner-application form.
   ────────────────────────────────────────────────────────────────────── */
const partnerForm = document.querySelector('form[name="partner-application"]:not([hidden])');
if (partnerForm) {
  partnerForm.addEventListener('submit', () => {
    const roleSelect = partnerForm.querySelector('select[name="type"]');
    window.dataLayer.push({
      event: 'form_submit',
      form_name: 'partner_application',
      applicant_type: roleSelect ? roleSelect.value : 'unknown'
    });
  });
}

/* ── Thank-you page: fire conversion event on load ──────────────────────
   When /thank-you.html loads, push a 'form_conversion' event so GTM
   can fire a GA4 conversion and any future ad pixels from one place.
   ────────────────────────────────────────────────────────────────────── */
if (window.location.pathname.includes('thank-you')) {
  window.dataLayer.push({
    event: 'form_conversion',
    form_name: 'partner_application'
  });
}

/* ── Scroll depth milestones → GA4 ─────────────────────────────────────
   Fires 'scroll_depth' at 25 / 50 / 75 / 100% page scroll.
   ────────────────────────────────────────────────────────────────────── */
const depthsFired = new Set();
window.addEventListener('scroll', () => {
  const scrolled  = window.scrollY + window.innerHeight;
  const total     = document.documentElement.scrollHeight;
  const pct       = Math.round((scrolled / total) * 100);
  [25, 50, 75, 100].forEach((milestone) => {
    if (pct >= milestone && !depthsFired.has(milestone)) {
      depthsFired.add(milestone);
      window.dataLayer.push({
        event: 'scroll_depth',
        depth_percent: milestone
      });
    }
  });
}, { passive: true });

/* ── FAQ open tracking ──────────────────────────────────────────────────
   Fires 'faq_open' each time a visitor expands a FAQ item.
   ────────────────────────────────────────────────────────────────────── */
document.querySelectorAll('.faq-list details').forEach((detail) => {
  detail.addEventListener('toggle', () => {
    if (detail.open) {
      const question = detail.querySelector('summary');
      window.dataLayer.push({
        event: 'faq_open',
        faq_question: question ? question.textContent.trim() : 'unknown'
      });
    }
  });
});

/* ── Scroll-fade-in for cards ───────────────────────────────────────────── */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(
  '.step-card, .feature-card, .audience-card, .info-card, .callout-card'
).forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(22px)';
  el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
  observer.observe(el);
});
