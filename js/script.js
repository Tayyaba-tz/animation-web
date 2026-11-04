(() => {
  'use strict';
  document.documentElement.classList.add('js');

  // Reveal on enter. Also the fallback when scroll timelines are unsupported.
  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.15 });
    revealItems.forEach((el) => io.observe(el));
  } else {
    revealItems.forEach((el) => el.classList.add('in'));
  }

  // Missing images: keep the layout and show a flat block instead of a broken icon.
  document.querySelectorAll('img').forEach((img) => {
    img.addEventListener('error', () => { img.style.visibility = 'hidden'; img.parentElement.style.background = '#2F4454'; });
  });

  // Scale needed for the screen to cover the viewport (used by the CSS keyframes).
  const root = document.documentElement;
  const updateCoverScale = () => {
    const cover = (el) => Math.max(root.clientWidth / el.offsetWidth, window.innerHeight / el.offsetHeight) * 1.02;
    const shot = document.querySelector('.shot');
    if (shot && shot.offsetWidth) root.style.setProperty('--k', cover(shot).toFixed(3));
  };
  updateCoverScale();
  window.addEventListener('resize', updateCoverScale, { passive: true });

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Contact form
  const form = document.getElementById('contact-form');
  if (!form) return;
  const status = form.querySelector('.form__status');
  const button = form.querySelector('button');
  const setStatus = (state, text) => { status.dataset.state = state; status.textContent = text; };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); setStatus('error', 'Please fix the highlighted fields.'); return; }
    if (form.elements.website.value) return; // honeypot caught a bot

    const endpoint = form.dataset.endpoint.trim();
    if (!endpoint) {
      setStatus('demo', 'Demo mode: no form endpoint is set, so this message was not sent.');
      return;
    }
    button.disabled = true;
    setStatus('', 'Sending...');
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10000);
    try {
      const res = await fetch(endpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' }, signal: controller.signal });
      if (!res.ok) throw new Error('Request failed');
      form.reset();
      setStatus('ok', 'Message sent. Thank you.');
    } catch (err) {
      setStatus('error', 'The message could not be sent. Please try again or use the email link.');
    } finally {
      clearTimeout(timer);
      button.disabled = false;
    }
  });
})();
