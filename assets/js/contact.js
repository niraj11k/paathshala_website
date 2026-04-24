window.submitForm = function submitForm() {
  const fname = document.getElementById('fname').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  const privacyEl = document.getElementById('privacy');
  const privacy = privacyEl ? privacyEl.checked : false;

  if (!fname || !email || !message) {
    alert('Please fill in your name, email, and message before submitting.');
    return;
  }
  if (!privacy) {
    alert('Please tick the privacy checkbox to proceed.');
    return;
  }
  const ok = document.getElementById('success-msg');
  const btn = document.querySelector('.form-submit');
  if (ok) ok.style.display = 'block';
  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Message sent ✓';
  }
};

window.toggleFaq = function toggleFaq(btn) {
  if (!btn) return;
  const ans = btn.nextElementSibling;
  const icon = btn.querySelector('span');
  if (!ans || !icon) return;
  const isOpen = ans.classList.contains('open');
  document.querySelectorAll('.faq-a').forEach(function (a) { a.classList.remove('open'); });
  document.querySelectorAll('.faq-q span').forEach(function (s) { s.textContent = '＋'; });
  document.querySelectorAll('.faq-q').forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
  if (!isOpen) {
    ans.classList.add('open');
    icon.textContent = '－';
    btn.setAttribute('aria-expanded', 'true');
  }
};

function initProgramFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const raw = params.get('program');
  if (!raw) return;
  const want = String(raw).trim().toLowerCase();
  const sel = document.getElementById('program');
  if (!sel) return;
  for (let i = 0; i < sel.options.length; i++) {
    const opt = sel.options[i];
    if (opt.value && String(opt.value).toLowerCase() === want) {
      opt.selected = true;
      break;
    }
  }
}

function initTopicFromUrl() {
  const topic = (new URLSearchParams(window.location.search).get('topic') || '').trim().toLowerCase();
  if (topic !== 'privacy' && topic !== 'terms') return;
  const msg = document.getElementById('message');
  if (!msg || msg.value.trim()) return;
  if (topic === 'privacy') {
    msg.value = 'Hello,\n\nI would like information about your privacy policy.\n\n';
  } else {
    msg.value = 'Hello,\n\nI would like information about your terms of use.\n\n';
  }
}

function initContactFromUrl() {
  initProgramFromUrl();
  initTopicFromUrl();
}

initContactFromUrl();
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initContactFromUrl);
}
