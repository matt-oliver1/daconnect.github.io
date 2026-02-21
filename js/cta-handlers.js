document.addEventListener('DOMContentLoaded', function () {
  const enterpriseBtn = document.querySelector('.enterprise-contact-btn');
  const enquiryTypeField = document.getElementById('enquiryType');
  const messageField = document.getElementById('message');

  if (enterpriseBtn) {
    enterpriseBtn.addEventListener('click', function (e) {
      if (enquiryTypeField) {
        enquiryTypeField.value = this.getAttribute('data-enquiry-type');
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
          const response = await fetch('https://app.daconnect.com.au/api/public/exclusive/request-sample', {
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
});
