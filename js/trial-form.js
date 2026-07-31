document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('trialForm');
  if (!form) return;

  const feedback = document.getElementById('trialFeedback');
  const submitBtn = form.querySelector('.trial-btn-primary');
  const originalText = submitBtn ? submitBtn.textContent : 'START MY FREE TRIAL';

  // Copies a hero-card value into the contact form, leaving the target alone if
  // the card field is blank so we never wipe something already typed below.
  function carryOver(sourceId, targetId) {
    const value = (document.getElementById(sourceId)?.value || '').trim();
    if (!value) return;
    const target = document.getElementById(targetId);
    if (target) target.value = value;
  }

  // "Enquire now" drops the visitor into the existing contact form rather than
  // handing off to signup, carrying anything they already typed with them.
  const enquireBtn = form.querySelector('.enquire-now-btn');
  if (enquireBtn) {
    enquireBtn.addEventListener('click', function (e) {
      const contactSection = document.getElementById('contact');
      if (!contactSection) return;
      e.preventDefault();

      carryOver('trialName', 'name');
      carryOver('trialBusiness', 'business');
      carryOver('trialEmail', 'email');

      const category = document.getElementById('enquiryCategory');
      if (category) category.value = 'free-trial';

      // Only seed the message if they haven't written their own.
      const message = document.getElementById('message');
      if (message && !message.value.trim()) {
        message.value = 'I\'d like to know more about the 14-day free trial.';
      }

      contactSection.scrollIntoView({ behavior: 'smooth' });
      // Fire once the scroll has roughly landed, so the pulse is actually seen.
      setTimeout(glowSendButton, 700);
    });
  }

  // Draws the eye to the next action after the handoff from the hero card. The
  // pulse loops until they actually send, so it can't be missed.
  function glowSendButton() {
    const sendBtn = document.querySelector('#contactForm button[type="submit"]');
    if (!sendBtn) return;
    // Removing and forcing a reflow restarts the animation if it was cleared.
    sendBtn.classList.remove('btn-attention-glow');
    void sendBtn.offsetWidth;
    sendBtn.classList.add('btn-attention-glow');
  }

  // Nothing left to draw attention to once the message is on its way.
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function () {
      const sendBtn = contactForm.querySelector('button[type="submit"]');
      if (sendBtn) sendBtn.classList.remove('btn-attention-glow');
    });
  }

  // Builds the feedback line from text nodes so nothing is ever parsed as HTML.
  function showFeedback(type, text, mailto) {
    if (!feedback) return;
    feedback.className = 'trial-feedback is-' + type;
    feedback.textContent = text;
    if (mailto) {
      const link = document.createElement('a');
      link.href = 'mailto:' + mailto;
      link.className = 'fw-semibold';
      link.textContent = mailto;
      feedback.append(' ', link, '.');
    }
  }

  function markInvalid(field, invalid) {
    if (field) field.classList.toggle('is-invalid', invalid);
  }

  const SIGNUP_URL = 'https://app.daconnect.com.au/freetrial';

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const nameField = document.getElementById('trialName');
    const emailField = document.getElementById('trialEmail');
    const businessField = document.getElementById('trialBusiness');

    const name = (nameField?.value || '').trim();
    const email = (emailField?.value || '').trim();
    const business = (businessField?.value || '').trim();

    markInvalid(nameField, !name);
    markInvalid(emailField, !email);

    if (!name || !email) {
      showFeedback('error', 'Please enter your name and email address.');
      return;
    }

    // Hand off to the signup app with the fields pre-filled. URLSearchParams
    // handles the encoding, so spaces and & in a business name stay intact.
    const params = new URLSearchParams({ name, business, email });
    for (const [key, value] of [...params]) {
      if (!value) params.delete(key);
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'REDIRECTING...';
    }

    window.location.href = SIGNUP_URL + '?' + params.toString();
  });

  // Navigating back can restore this page from the bfcache with the button
  // still frozen in its redirecting state.
  window.addEventListener('pageshow', function () {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
});
