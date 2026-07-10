const form = document.getElementById('contactForm');
const statusEl = document.getElementById('formStatus');
const submitBtn = document.getElementById('submitBtn');
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function setError(fieldName, message) {
const errEl = form.querySelector(`.field-error[data-for="${fieldName}"]`);
const input = form.querySelector(`[name="${fieldName}"]`);
if (errEl) errEl.textContent = message;
if (input) input.closest('.field').classList.toggle('invalid', Boolean(message));
}
function validate() {
let ok = true;
const name = form.name.value.trim();
const email = form.email.value.trim();
const message = form.message.value.trim();
setError('name', ''); setError('email', ''); setError('message', '');
if (!name) { setError('name', 'Please enter your name.'); ok = false; }
if (!email) {
setError('email', 'Please enter your email.'); ok = false;
} else if (!emailPattern.test(email)) {
setError('email', 'Please enter a valid email address.'); ok = false;
}
if (!message) { setError('message', 'Please enter a short message.'); ok = false; }
return ok;
}
['name', 'email', 'message'].forEach(fieldName => {
const input = form.querySelector(`[name="${fieldName}"]`);
if (input) input.addEventListener('input', () => setError(fieldName, ''));
});
form.addEventListener('submit', async (e) => {
e.preventDefault();
statusEl.className = 'form-status';
statusEl.textContent = '';
if (form.botcheck.checked) {
statusEl.classList.add('success');
statusEl.textContent = 'Thank you — your message has been sent.';
form.reset();
return;
}
if (!validate()) {
statusEl.classList.add('error');
statusEl.textContent = 'Please fix the highlighted fields and try again.';
return;
}
submitBtn.disabled = true;
submitBtn.querySelector('span').textContent = 'Sending…';
try {
const formData = new FormData(form);
const response = await fetch('https://api.web3forms.com/submit', {
method: 'POST',
headers: { 'Accept': 'application/json' },
body: formData
});
const data = await response.json();
if (data.success) {
statusEl.classList.add('success');
statusEl.textContent = 'Thank you — your message has been sent. We’ll be in touch within one business day.';
form.reset();
} else {
statusEl.classList.add('error');
statusEl.textContent = 'Something went wrong sending your message. Please email us directly at info@gdbmedia.com.au.';
}
} catch (err) {
statusEl.classList.add('error');
statusEl.textContent = 'Network error — please check your connection, or email us directly at info@gdbmedia.com.au.';
} finally {
submitBtn.disabled = false;
submitBtn.querySelector('span').textContent = 'Send Message';
}
});