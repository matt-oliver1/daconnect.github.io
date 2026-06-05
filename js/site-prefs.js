/*
 * DAconnect site preferences (opt-in analytics consent)
 * --------------------------------------------------------------
 * No analytics / measurement script loads until the visitor clicks
 * "Accept". The choice is remembered in localStorage so the banner
 * only appears once. If the visitor declines (or never chooses),
 * none of the measurement scripts run.
 *
 * NOTE: This file is intentionally named "site-prefs.js" (not
 * "cookie-consent.js"). Ad/privacy blockers ship filter lists that
 * block any request whose filename matches "cookie-consent", which
 * caused ERR_BLOCKED_BY_CLIENT and stopped the banner from loading.
 * Keep the filename and the element IDs below free of words like
 * "cookie"/"consent" so the script is not blocked.
 *
 * To let a visitor change their mind, add this anywhere on the page:
 *   <a href="#" data-prefs-settings>Cookie Settings</a>
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'daconnect_cookie_consent'; // 'accepted' | 'declined'
  var loaded = false; // guard against double-injecting trackers

  /* ----- Tracker loaders (only called after consent) ----------- */

  function loadGoogleAnalytics() {
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=G-DDP7CQQF6R';
    document.head.appendChild(s);

    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', 'G-DDP7CQQF6R');
  }

  function loadClarity() {
    (function (c, l, a, r, i, t, y) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
      t = l.createElement(r); t.async = 1; t.src = 'https://www.clarity.ms/tag/' + i;
      y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, 'clarity', 'script', 'vbmkr6j6f3');
  }

  function loadMetaPixel() {
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
      n.queue = []; t = b.createElement(e); t.async = !0;
      t.src = v; s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', '838312912574438');
    window.fbq('track', 'PageView');
  }

  function loadTrackers() {
    if (loaded) return;
    loaded = true;
    loadGoogleAnalytics();
    loadClarity();
    loadMetaPixel();
  }

  /* ----- Consent storage --------------------------------------- */

  function getConsent() {
    try { return localStorage.getItem(STORAGE_KEY); }
    catch (e) { return null; }
  }

  function setConsent(value) {
    try { localStorage.setItem(STORAGE_KEY, value); } catch (e) {}
  }

  function accept() {
    setConsent('accepted');
    removeBanner();
    loadTrackers();
  }

  function decline() {
    setConsent('declined');
    removeBanner();
  }

  /* ----- Banner UI --------------------------------------------- */

  function injectStyles() {
    if (document.getElementById('dac-prefs-styles')) return;
    var css =
      '#dac-prefs-banner{position:fixed;right:1rem;bottom:1rem;z-index:2000;' +
      'width:330px;max-width:calc(100vw - 2rem);background:#fff;color:#1d3557;border:1px solid rgba(0,0,0,.08);' +
      'border-radius:14px;box-shadow:0 10px 30px rgba(0,0,0,.18);padding:1rem 1.1rem;' +
      "font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;" +
      'opacity:0;transform:translateY(12px);transition:opacity .35s ease,transform .35s ease;}' +
      '#dac-prefs-banner.dac-show{opacity:1;transform:translateY(0);}' +
      '#dac-prefs-banner .dac-title{font-weight:700;font-size:.95rem;margin:0 0 .3rem;' +
      "font-family:'Plus Jakarta Sans','Segoe UI',sans-serif;}" +
      '#dac-prefs-banner p{font-size:.8rem;line-height:1.5;color:#495057;margin:0 0 .8rem;}' +
      '#dac-prefs-banner a.dac-link{color:#2d7b5b;text-decoration:underline;}' +
      '#dac-prefs-banner .dac-actions{display:flex;flex-wrap:wrap;gap:.5rem;justify-content:flex-end;}' +
      '#dac-prefs-banner button{border:0;border-radius:8px;padding:.45rem 1.05rem;font-weight:600;' +
      'font-size:.82rem;cursor:pointer;transition:background .2s ease,color .2s ease,border-color .2s ease;}' +
      '#dac-prefs-banner .dac-accept{background:#2d7b5b;color:#fff;}' +
      '#dac-prefs-banner .dac-accept:hover{background:#256648;}' +
      '#dac-prefs-banner .dac-decline{background:transparent;color:#1d3557;border:1px solid #ced4da;}' +
      '#dac-prefs-banner .dac-decline:hover{background:#f1f3f5;border-color:#adb5bd;}' +
      '@media (max-width:575px){#dac-prefs-banner .dac-actions{justify-content:stretch;}' +
      '#dac-prefs-banner .dac-actions button{flex:1;}}';
    var style = document.createElement('style');
    style.id = 'dac-prefs-styles';
    style.textContent = css;
    document.head.appendChild(style);
  }

  function removeBanner() {
    var el = document.getElementById('dac-prefs-banner');
    if (!el) return;
    el.classList.remove('dac-show');
    setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 350);
  }

  function showBanner() {
    if (document.getElementById('dac-prefs-banner')) return;
    injectStyles();

    var banner = document.createElement('div');
    banner.id = 'dac-prefs-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-live', 'polite');
    banner.setAttribute('aria-label', 'Privacy preferences');
    banner.innerHTML =
      '<div class="dac-title">We value your privacy</div>' +
      '<p>We use cookies to improve your experience, analyse site usage and support our ' +
      'marketing. These only run if you accept. See our ' +
      '<a class="dac-link" href="compliance.html">Compliance &amp; Privacy</a> page for details.</p>' +
      '<div class="dac-actions">' +
      '<button type="button" class="dac-decline">Decline</button>' +
      '<button type="button" class="dac-accept">Accept</button>' +
      '</div>';

    document.body.appendChild(banner);
    banner.querySelector('.dac-accept').addEventListener('click', accept);
    banner.querySelector('.dac-decline').addEventListener('click', decline);

    // Trigger the entrance transition on the next frame.
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { banner.classList.add('dac-show'); });
    });
  }

  /* ----- "Cookie Settings" re-open link ------------------------ */
  // Any element with [data-prefs-settings] re-opens the banner.
  document.addEventListener('click', function (e) {
    var trigger = e.target.closest && e.target.closest('[data-prefs-settings]');
    if (trigger) {
      e.preventDefault();
      showBanner();
    }
  });

  // Public API
  window.DAprefs = {
    reopen: showBanner,
    accept: accept,
    decline: decline,
    consent: getConsent
  };

  /* ----- Init -------------------------------------------------- */
  function init() {
    if (getConsent() === 'accepted') {
      loadTrackers();
    } else if (getConsent() === null) {
      showBanner();
    }
    // 'declined' -> do nothing
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
