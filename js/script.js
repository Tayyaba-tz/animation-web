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

  // Scale at which the whole screenshot fits the viewport without cropping (used by the CSS keyframes).
  const root = document.documentElement;
  const updateCoverScale = () => {
    const fit = (el) => Math.min(root.clientWidth / el.offsetWidth, window.innerHeight / el.offsetHeight) * 0.98;
    const shot = document.querySelector('.shot');
    if (shot && shot.offsetWidth) root.style.setProperty('--k', fit(shot).toFixed(3));
  };
  updateCoverScale();
  window.addEventListener('resize', updateCoverScale, { passive: true });

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Contact form: drafts and sent messages are saved in localStorage
  const form = document.getElementById('contact-form');
  if (!form) return;
  const status = form.querySelector('.form__status');
  const button = form.querySelector('button');
  const DRAFT_KEY = 'contact_draft';       // unsent text, restored on reload
  const SAVED_KEY = 'contact_messages';    // submitted messages, newest last
  const MAX_SAVED = 50;
  const FIELDS = ['name', 'email', 'subject', 'message'];
  const setStatus = (state, text) => { status.dataset.state = state; status.textContent = text; };

  // localStorage can be blocked or full, so every access is wrapped.
  const store = {
    read(key, fallback) {
      try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; } catch (e) { return fallback; }
    },
    write(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch (e) { return false; }
    },
    remove(key) { try { localStorage.removeItem(key); } catch (e) { /* ignore */ } }
  };

  // Restore an unsent draft
  const draft = store.read(DRAFT_KEY, null);
  if (draft && typeof draft === 'object') {
    FIELDS.forEach((f) => { if (typeof draft[f] === 'string') form.elements[f].value = draft[f]; });
  }
  // Save the draft while typing
  form.addEventListener('input', () => {
    const data = {};
    FIELDS.forEach((f) => { data[f] = form.elements[f].value; });
    store.write(DRAFT_KEY, data);
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); setStatus('error', 'Please fix the highlighted fields.'); return; }
    if (form.elements.website.value) return; // honeypot caught a bot

    const entry = { sentAt: new Date().toISOString() };
    FIELDS.forEach((f) => { entry[f] = form.elements[f].value.trim(); });

    const list = store.read(SAVED_KEY, []);
    list.push(entry);
    const saved = store.write(SAVED_KEY, list.slice(-MAX_SAVED));

    const endpoint = form.dataset.endpoint.trim();
    if (!endpoint) {
      // No server: the message exists only in this browser.
      if (!saved) { setStatus('error', 'Could not save the message. Browser storage is blocked or full.'); return; }
      store.remove(DRAFT_KEY);
      form.reset();
      setStatus('demo', 'Saved in this browser (localStorage). It was not sent to anyone.');
      return;
    }

    button.disabled = true;
    setStatus('', 'Sending...');
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10000);
    try {
      const res = await fetch(endpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' }, signal: controller.signal });
      if (!res.ok) throw new Error('Request failed');
      store.remove(DRAFT_KEY);
      form.reset();
      setStatus('ok', 'Message sent and saved. Thank you.');
    } catch (err) {
      setStatus('error', 'The message could not be sent. Your text is kept, so you can try again.');
    } finally {
      clearTimeout(timer);
      button.disabled = false;
    }
  });
})();
