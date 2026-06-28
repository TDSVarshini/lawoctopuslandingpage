
function initCountdown() {
  const deadline = new Date('2026-06-30T23:59:59');

  const dEl = document.getElementById('cd-days');
  const hEl = document.getElementById('cd-hours');
  const mEl = document.getElementById('cd-minutes');
  const sEl = document.getElementById('cd-seconds');

  if (!dEl) return;

  function tick() {
    const now  = new Date();
    const diff = deadline - now;

    if (diff <= 0) {
      document.getElementById('countdown-block').innerHTML =
        '<p class="cd-expired">Registration is now closed.</p>';
      return;
    }

    const days    = Math.floor(diff / 86400000);
    const hours   = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000)  / 60000);
    const seconds = Math.floor((diff % 60000)    / 1000);

    dEl.textContent = String(days).padStart(2, '0');
    hEl.textContent = String(hours).padStart(2, '0');
    mEl.textContent = String(minutes).padStart(2, '0');
    sEl.textContent = String(seconds).padStart(2, '0');
  }

  tick();
  setInterval(tick, 1000);
}



function initModal() {
  const modal     = document.getElementById('lead-modal');
  const overlay   = document.getElementById('modal-overlay');
  const closeBtn  = document.getElementById('modal-close');
  const form      = document.getElementById('lead-form');
  const successEl = document.getElementById('form-success');

  
  document.querySelectorAll('[data-modal="open"]').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      openModal();
    });
  });

  function openModal() {
    modal.removeAttribute('hidden');
    modal.setAttribute('aria-hidden', 'false');
    overlay.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    // focus first field
    setTimeout(() => {
      const first = modal.querySelector('input');
      if (first) first.focus();
    }, 80);
  }

  function closeModal() {
    modal.setAttribute('hidden', '');
    modal.setAttribute('aria-hidden', 'true');
    overlay.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  if (closeBtn)  closeBtn.addEventListener('click', closeModal);
  if (overlay)   overlay.addEventListener('click', closeModal);

  
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });

  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    clearErrors();

    const name  = form.querySelector('#f-name');
    const email = form.querySelector('#f-email');
    const phone = form.querySelector('#f-phone');
    let valid   = true;

    if (!name.value.trim() || name.value.trim().length < 2) {
      showError(name, 'Please enter your full name.');
      valid = false;
    }

    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRx.test(email.value.trim())) {
      showError(email, 'Please enter a valid email address.');
      valid = false;
    }

    const phoneRx = /^[6-9]\d{9}$/;
    if (!phoneRx.test(phone.value.replace(/\s/g, ''))) {
      showError(phone, 'Please enter a valid 10-digit Indian mobile number.');
      valid = false;
    }

    if (!valid) return;

    
    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.textContent = 'Submitting…';
    submitBtn.disabled = true;

    setTimeout(() => {
      form.style.display = 'none';
      successEl.removeAttribute('hidden');

      
      if (typeof gtag !== 'undefined') {
        gtag('event', 'lead_form_submit', {
          event_category: 'conversion',
          event_label: 'lawctopus_course_lead'
        });
      }
    }, 900);
  });

  function showError(input, msg) {
    const err = input.parentElement.querySelector('.field-error');
    if (err) { err.textContent = msg; err.removeAttribute('hidden'); }
    input.setAttribute('aria-invalid', 'true');
    input.classList.add('input-error');
  }

  function clearErrors() {
    form.querySelectorAll('.field-error').forEach(el => {
      el.setAttribute('hidden', '');
      el.textContent = '';
    });
    form.querySelectorAll('input').forEach(el => {
      el.removeAttribute('aria-invalid');
      el.classList.remove('input-error');
    });
  }
}


function initFloatingCTA() {
  const btn    = document.getElementById('float-cta');
  const footer = document.querySelector('footer');
  if (!btn || !footer) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      btn.style.opacity      = entry.isIntersecting ? '0' : '1';
      btn.style.pointerEvents = entry.isIntersecting ? 'none' : 'auto';
    });
  }, { threshold: 0 });

  io.observe(footer);
}


function initFAQ() {
  // Native <details> already handles click; add keyboard support for arrows
  const summaries = document.querySelectorAll('.faq-list summary');
  summaries.forEach((s, i) => {
    s.setAttribute('tabindex', '0');
    s.addEventListener('keydown', e => {
      if (e.key === 'ArrowDown') { e.preventDefault(); summaries[i + 1]?.focus(); }
      if (e.key === 'ArrowUp')   { e.preventDefault(); summaries[i - 1]?.focus(); }
      if (e.key === 'Home')      { e.preventDefault(); summaries[0]?.focus(); }
      if (e.key === 'End')       { e.preventDefault(); summaries[summaries.length - 1]?.focus(); }
    });
  });
}

function initReveal() {
  const els = document.querySelectorAll(
    '.module-card, .solution-card, .outcome-item, .testimonial-card, .audience-card, .tl-item, .ba-col'
  );

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => { el.classList.add('reveal-target'); io.observe(el); });
}


function initNav() {
  const nav = document.querySelector('nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('nav-scrolled', window.scrollY > 60);
  }, { passive: true });
}

document.addEventListener('DOMContentLoaded', () => {
  initCountdown();
  initModal();
  initFloatingCTA();
  initFAQ();
  initReveal();
  initNav();
});