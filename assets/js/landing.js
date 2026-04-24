window.submitLanding = function submitLanding() {
  const fname = document.getElementById('l-fname').value.trim();
  const email = document.getElementById('l-email').value.trim();
  const phone = document.getElementById('l-phone').value.trim();

  if (!fname || !email || !phone) {
    alert('Please fill in your name, email and phone number so we can get back to you.');
    return;
  }
  const btn = document.querySelector('.form-submit');
  btn.disabled = true;
  btn.textContent = 'Enquiry sent ✓';
  btn.style.background = '#2e7d32';
  document.getElementById('l-success').style.display = 'block';
};

function initLandingProgramFromUrl() {
  var params = new URLSearchParams(window.location.search);
  var raw = params.get('program');
  if (!raw) return;
  var want = String(raw).trim().toLowerCase();
  var sel = document.getElementById('l-program');
  if (!sel) return;
  for (var i = 0; i < sel.options.length; i++) {
    var v = sel.options[i].value;
    if (v && String(v).toLowerCase() === want) {
      sel.options[i].selected = true;
      break;
    }
  }
}

initLandingProgramFromUrl();
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLandingProgramFromUrl);
}
