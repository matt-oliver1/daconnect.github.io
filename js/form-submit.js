document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('contactForm');
  if (!form) return;
  const submitBtn = form.querySelector('button[type="submit"]');
  const spinner = submitBtn ? submitBtn.querySelector('.spinner-border') : null;
  const successAlert = document.getElementById('formSuccess');
  const errorAlert = document.getElementById('formError');

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    if (submitBtn && spinner) {
      submitBtn.disabled = true;
      spinner.classList.remove('d-none');
    }
    if (successAlert) successAlert.classList.add('d-none');
    if (errorAlert) errorAlert.classList.add('d-none');

    try {
      const formData = new FormData(form);
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        if (successAlert) {
          successAlert.classList.remove('d-none');
          successAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        form.reset();
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      if (errorAlert) {
        errorAlert.classList.remove('d-none');
        errorAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } finally {
      if (submitBtn && spinner) {
        submitBtn.disabled = false;
        spinner.classList.add('d-none');
      }
    }
  });
});
