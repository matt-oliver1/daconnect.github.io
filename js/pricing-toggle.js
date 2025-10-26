document.addEventListener('DOMContentLoaded', function() {
  // Get the pricing toggle element
  const pricingToggle = document.getElementById('pricingToggle');
  const pricingPeriods = document.querySelectorAll('.pricing-period');
  const prices = document.querySelectorAll('.price');
  const periods = document.querySelectorAll('.period');
  
  // Build app.<root-domain> dynamically from current hostname
  function getRootDomain(hostname) {
    if (!hostname) return '';
    if (hostname === 'localhost' || /^(\d+\.){3}\d+$/.test(hostname)) return hostname;
    const parts = hostname.split('.');
    if (parts.length >= 3 && parts.slice(-2).join('.') === 'com.au') {
      return parts.slice(-3).join('.');
    }
    return parts.slice(-2).join('.');
  }
  function getAppBaseUrl() {
    const protocol = window.location.protocol === 'http:' ? 'http:' : 'https:';
    const root = getRootDomain(window.location.hostname);
    return `${protocol}//app.${root}`;
  }
  const appBaseUrl = getAppBaseUrl();
  
  // Robustly locate the Standard and Exclusive plan buttons by card content
  // Standard: the card with a dynamic price span having data-monthly/data-yearly
  const standardPriceEl = document.querySelector('#pricing .pricing-card .price');
  const standardCard = standardPriceEl ? standardPriceEl.closest('.pricing-card') : null;
  const standardButton = standardCard ? standardCard.querySelector('.btn') : null;

  // Exclusive: the card that contains the Exclusive image
  const exclusiveMarker = document.querySelector('#pricing .pricing-card img[alt="DAconnect Exclusive"]');
  const exclusiveCard = exclusiveMarker ? exclusiveMarker.closest('.pricing-card') : null;
  const exclusiveButton = exclusiveCard ? exclusiveCard.querySelector('.btn') : null;
  
  if (standardButton) {
    standardButton.classList.add('subscription-link');
    standardButton.dataset.plan = 'list';
  }
  
  if (exclusiveButton) {
    exclusiveButton.classList.add('subscription-link');
    exclusiveButton.dataset.plan = 'exclusive';
  }
  
  // Enterprise button should not be affected by the pricing toggle
  // It should maintain its original href="#contact" behavior
  
  const subscriptionLinks = document.querySelectorAll('.subscription-link');
  
  // Initialize subscription links
  updateSubscriptionLinks(false);
  
  // Add event listener to the toggle
  pricingToggle.addEventListener('change', function() {
    const isYearly = this.checked;
    updatePricing(isYearly);
  });
  
  // Add click handler for period labels
  pricingPeriods.forEach(period => {
    period.addEventListener('click', function() {
      const isYearly = this.dataset.period === 'yearly';
      pricingToggle.checked = isYearly;
      updatePricing(isYearly);
    });
  });
  
  function updatePricing(isYearly) {
    // Update active period styling
    pricingPeriods.forEach(period => {
      if ((period.dataset.period === 'yearly' && isYearly) || 
          (period.dataset.period === 'monthly' && !isYearly)) {
        period.classList.add('active');
      } else {
        period.classList.remove('active');
      }
    });
    
    // Update prices
    prices.forEach(price => {
      price.textContent = isYearly ? price.dataset.yearly : price.dataset.monthly;
    });
    
    // Update period text
    periods.forEach(period => {
      period.textContent = isYearly ? '/year' : '/month';
    });
    
    // Update subscription links
    updateSubscriptionLinks(isYearly);
  }
  
  function updateSubscriptionLinks(isYearly) {
    subscriptionLinks.forEach(link => {
      const plan = link.dataset.plan;
      // Force Exclusive plan to always use yearly occurrence regardless of toggle
      const occurrence = plan === 'exclusive' ? 'yearly' : (isYearly ? 'yearly' : 'monthly');
      // Use JS redirect function if available; otherwise, fall back to direct URL
      // Prevent duplicate listeners when toggling pricing
      if (!link.dataset.subscriptionBound) {
        link.addEventListener('click', function(e) {
          e.preventDefault();
          // Compute current values at click time to avoid stale closures
          const currentPlan = this.dataset.plan;
          const isYearlyNow = currentPlan === 'exclusive' ? true : (!!pricingToggle && !!pricingToggle.checked);
          const currentOccurrence = isYearlyNow ? 'yearly' : 'monthly';
          if (typeof window.redirectToSubscription === 'function') {
            window.redirectToSubscription({ plan: currentPlan, occurrence: currentOccurrence });
          } else {
            window.location.href = `${appBaseUrl}/subscription?plan=${currentPlan}&occurrence=${currentOccurrence}`;
          }
        });
        link.dataset.subscriptionBound = '1';
      }
      // Also set href for accessibility and as a non-JS fallback
      link.href = `${appBaseUrl}/subscription?plan=${plan}&occurrence=${occurrence}`;
    });
  }
});
