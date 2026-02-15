document.addEventListener('DOMContentLoaded', function() {
  var pricingToggle = document.getElementById('pricingToggle');
  var pricingPeriods = document.querySelectorAll('.pricing-period');
  var prices = document.querySelectorAll('.price');
  var periods = document.querySelectorAll('.period');
  var savings = document.querySelector('.pricing-savings');
  var cancelAnytime = document.getElementById('cancelAnytime');

  // Build app.<root-domain> dynamically from current hostname
  function getRootDomain(hostname) {
    if (!hostname) return '';
    if (hostname === 'localhost' || /^(\d+\.){3}\d+$/.test(hostname)) return hostname;
    var parts = hostname.split('.');
    if (parts.length >= 3 && parts.slice(-2).join('.') === 'com.au') {
      return parts.slice(-3).join('.');
    }
    return parts.slice(-2).join('.');
  }
  function getAppBaseUrl() {
    var protocol = window.location.protocol === 'http:' ? 'http:' : 'https:';
    var root = getRootDomain(window.location.hostname);
    return protocol + '//app.' + root;
  }
  var appBaseUrl = getAppBaseUrl();

  if (!pricingToggle) return;

  // Initialize subscription links
  var subscriptionLinks = document.querySelectorAll('.subscription-link');
  updateSubscriptionLinks(false);

  pricingToggle.addEventListener('change', function() {
    updatePricing(this.checked);
  });

  pricingPeriods.forEach(function(period) {
    period.addEventListener('click', function() {
      var isYearly = this.dataset.period === 'yearly';
      pricingToggle.checked = isYearly;
      updatePricing(isYearly);
    });
  });

  function updatePricing(isYearly) {
    pricingPeriods.forEach(function(period) {
      if ((period.dataset.period === 'yearly' && isYearly) ||
          (period.dataset.period === 'monthly' && !isYearly)) {
        period.classList.add('active');
      } else {
        period.classList.remove('active');
      }
    });

    prices.forEach(function(price) {
      price.textContent = isYearly ? price.dataset.yearly : price.dataset.monthly;
    });

    periods.forEach(function(period) {
      period.textContent = isYearly ? '/year' : '/month';
    });

    if (savings) {
      savings.style.display = isYearly ? 'inline-block' : 'none';
    }

    if (cancelAnytime) {
      if (isYearly) {
        cancelAnytime.classList.add('d-none');
        cancelAnytime.classList.remove('d-flex');
      } else {
        cancelAnytime.classList.remove('d-none');
        cancelAnytime.classList.add('d-flex');
      }
    }

    updateSubscriptionLinks(isYearly);
  }

  function updateSubscriptionLinks(isYearly) {
    var sandboxUrl = 'https://app.daconnect.com.au/sandbox/subscription';
    subscriptionLinks.forEach(function(link) {
      var occurrence = isYearly ? 'yearly' : 'monthly';

      if (!link.dataset.subscriptionBound) {
        link.addEventListener('click', function(e) {
          e.preventDefault();
          var currentOccurrence = pricingToggle.checked ? 'yearly' : 'monthly';
          window.location.href = sandboxUrl + '?exclusive&occurrence=' + currentOccurrence;
        });
        link.dataset.subscriptionBound = '1';
      }

      link.href = sandboxUrl + '?exclusive&occurrence=' + occurrence;
    });
  }
});
