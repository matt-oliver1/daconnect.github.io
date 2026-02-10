document.addEventListener('DOMContentLoaded', function() {
  var pricingToggle = document.getElementById('pricingToggle');
  var pricingPeriods = document.querySelectorAll('.pricing-period');
  var prices = document.querySelectorAll('.price');
  var periods = document.querySelectorAll('.period');
  var savings = document.querySelector('.pricing-savings');

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

    updateSubscriptionLinks(isYearly);
  }

  function updateSubscriptionLinks(isYearly) {
    subscriptionLinks.forEach(function(link) {
      var plan = link.dataset.plan;
      var occurrence = isYearly ? 'yearly' : 'monthly';

      if (!link.dataset.subscriptionBound) {
        link.addEventListener('click', function(e) {
          e.preventDefault();
          var currentOccurrence = pricingToggle.checked ? 'yearly' : 'monthly';
          if (typeof window.redirectToSubscription === 'function') {
            window.redirectToSubscription({ plan: plan, occurrence: currentOccurrence });
          } else {
            window.location.href = appBaseUrl + '/subscription?plan=' + plan + '&occurrence=' + currentOccurrence;
          }
        });
        link.dataset.subscriptionBound = '1';
      }

      link.href = appBaseUrl + '/subscription?plan=' + plan + '&occurrence=' + occurrence;
    });
  }
});
