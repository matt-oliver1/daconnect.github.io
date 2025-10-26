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
      btn.addEventListener('click', function (e) {
        if (enquiryTypeField) {
          enquiryTypeField.value = this.getAttribute('data-enquiry-type') || 'Free Sample Request';
        }
        if (messageField && !messageField.value.trim()) {
          const preset = this.getAttribute('data-message') || "I'd like to receive free sample lists.";
          messageField.value = preset;
        }
        const fsName = document.getElementById('freeSampleName');
        const fsEmail = document.getElementById('freeSampleEmail');
        const contactName = document.getElementById('name');
        const contactEmail = document.getElementById('email');
        if (fsName && contactName && fsName.value.trim()) {
          contactName.value = fsName.value.trim();
        }
        if (fsEmail && contactEmail && fsEmail.value.trim()) {
          contactEmail.value = fsEmail.value.trim();
        }
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          e.preventDefault();
          contactSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }
});
