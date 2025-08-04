document.addEventListener('DOMContentLoaded', function() {
  // Get the pricing toggle element
  const pricingToggle = document.getElementById('pricingToggle');
  const pricingPeriods = document.querySelectorAll('.pricing-period');
  const prices = document.querySelectorAll('.price');
  const periods = document.querySelectorAll('.period');
  
  // Find all pricing buttons and add data-plan attribute
  // Using a more compatible approach to find the buttons
  const cards = document.querySelectorAll('.card');
  let basicButton, standardButton, enterpriseButton;
  
  cards.forEach(card => {
    const titleElement = card.querySelector('.fw-bold');
    if (titleElement) {
      const title = titleElement.textContent.trim();
      const button = card.querySelector('.btn');
      
      if (button) {
        if (title === 'Basic') {
          basicButton = button;
        } else if (title === 'Standard') {
          standardButton = button;
        } else if (title === 'Enterprise') {
          enterpriseButton = button;
        }
      }
    }
  });
  
  if (basicButton) {
    basicButton.classList.add('subscription-link');
    basicButton.dataset.plan = 'basic';
  }
  
  if (standardButton) {
    standardButton.classList.add('subscription-link');
    standardButton.dataset.plan = 'standard';
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
      const occurrence = isYearly ? 'yearly' : 'monthly';
      link.href = `https://app.data-scraping.com/subscription?plan=${plan}&occurrence=${occurrence}`;
    });
  }
});
