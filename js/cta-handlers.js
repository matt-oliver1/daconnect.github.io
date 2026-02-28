document.addEventListener('DOMContentLoaded', function () {
  const enterpriseBtn = document.querySelector('.enterprise-contact-btn');
  const enquiryCategoryField = document.getElementById('enquiryCategory');
  const messageField = document.getElementById('message');

  if (enterpriseBtn) {
    enterpriseBtn.addEventListener('click', function (e) {
      if (enquiryCategoryField) {
        enquiryCategoryField.value = this.getAttribute('data-enquiry-type');
      }
      if (messageField && !messageField.value.trim()) {
        messageField.value = 'I am interested in learning more about Enterprise pricing options.';
      }
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        e.preventDefault();
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  const freeSampleButtons = document.querySelectorAll('.free-sample-btn');
  if (freeSampleButtons && freeSampleButtons.length) {
    freeSampleButtons.forEach(btn => {
      btn.addEventListener('click', async function (e) {
        e.preventDefault();

        const nameInput = document.getElementById('freeSampleName');
        const emailInput = document.getElementById('freeSampleEmail');
        const feedback = document.getElementById('freeSampleFeedback');

        const name = nameInput ? nameInput.value.trim() : '';
        const email = emailInput ? emailInput.value.trim() : '';

        if (!name || !email) {
          if (feedback) {
            feedback.style.display = 'block';
            feedback.className = 'mt-3 text-danger';
            feedback.textContent = 'Please enter both your name and email.';
          }
          return;
        }

        btn.disabled = true;
        btn.textContent = 'Sending...';

        try {
          const response = await fetch('https://app.daconnect.com.au/api/public/exclusive/request-sample?notifyInternal=true', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email })
          });

          if (response.ok) {
            if (feedback) {
              feedback.style.display = 'block';
              feedback.className = 'mt-3 text-success fw-semibold';
              feedback.textContent = 'Your free sample has been requested! Check your inbox shortly.';
            }
            if (nameInput) nameInput.value = '';
            if (emailInput) emailInput.value = '';
          } else {
            throw new Error('Request failed');
          }
        } catch (err) {
          if (feedback) {
            feedback.style.display = 'block';
            feedback.className = 'mt-3 text-danger';
            feedback.textContent = 'Something went wrong. Please try again or email council@daconnect.com.au.';
          }
        } finally {
          btn.disabled = false;
          btn.textContent = 'Get Free Sample';
        }
      });
    });
  }

  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const feedback = document.getElementById('contactFeedback');
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.textContent : 'Send';

      const name = (contactForm.querySelector('[name="name"]')?.value || '').trim();
      const email = (contactForm.querySelector('[name="email"]')?.value || '').trim();
      const phone = (contactForm.querySelector('[name="phone"]')?.value || '').trim();
      const business = (contactForm.querySelector('[name="business"]')?.value || '').trim();
      const enquiryCategory = (contactForm.querySelector('[name="enquiryCategory"]')?.value || '').trim();
      const message = (contactForm.querySelector('[name="message"]')?.value || '').trim();

      if (!name || !email || !message) {
        if (feedback) {
          feedback.style.display = 'block';
          feedback.className = 'mt-3 text-danger';
          feedback.textContent = 'Please fill in your name, email, and message.';
        }
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
      }

      try {
        const response = await fetch('https://app.daconnect.com.au/api/public/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, phone, business, enquiryCategory, message })
        });

        if (response.ok) {
          if (feedback) {
            feedback.style.display = 'block';
            feedback.className = 'mt-3 text-success fw-semibold';
            feedback.textContent = 'Your message has been sent. We\'ll be in touch soon!';
          }
          contactForm.reset();
        } else {
          throw new Error('Request failed');
        }
      } catch (err) {
        if (feedback) {
          feedback.style.display = 'block';
          feedback.className = 'mt-3 text-danger';
          feedback.innerHTML = 'Something went wrong. Please try emailing us directly at <a href="mailto:council@daconnect.com.au" class="text-danger fw-semibold">council@daconnect.com.au</a>.';
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }
      }
    });
  }
});
