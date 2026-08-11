/* ==========================================================================
   Direction K — shared script
   Vanilla JS, no dependencies. Each block below is guarded so it is a
   no-op on pages that don't include its target markup — this single file
   is safe to include on all Direction K pages.
   Ported from demo/direction-g.html (region/feed, pricing, chat, forms).
   Deliberately NOT ported: G's fixed-1460px zoom/scaler script.
   ========================================================================== */

/* ---------- Mobile nav (hamburger) ---------- */
(function () {
  var burger = document.querySelector('.k-burger');
  if (!burger) return;
  burger.addEventListener('click', function () {
    var header = burger.closest('header');
    if (header) header.classList.toggle('nav-open');
  });
})();

/* ---------- Chat widget ---------- */
(function () {
  var chatBox = document.getElementById('v2-chat-box');
  if (!chatBox) return;

  var fab = document.querySelector('.k-chat-fab');
  if (fab) {
    fab.addEventListener('click', function () {
      chatBox.hidden = !chatBox.hidden;
    });
  }

  var closeBtn = chatBox.querySelector('.v2-chat-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', function () { chatBox.hidden = true; });
  }

  var body = chatBox.querySelector('.v2-chat-body');
  function say(t) {
    if (!body || !t) return;
    var u = document.createElement('div'); u.className = 'v2-chat-msg v2-chat-msg--me'; u.textContent = t;
    body.appendChild(u); body.scrollTop = body.scrollHeight;
    setTimeout(function () {
      var r = document.createElement('div'); r.className = 'v2-chat-msg';
      r.textContent = 'Thanks! One of our team will be right with you. Meanwhile, you can grab a free sample from the form on the page.';
      body.appendChild(r); body.scrollTop = body.scrollHeight;
    }, 600);
  }

  chatBox.querySelectorAll('.v2-chat-quick button').forEach(function (b) {
    b.addEventListener('click', function () { say(b.textContent); });
  });

  var input = chatBox.querySelector('.v2-chat-input input');
  var send = chatBox.querySelector('.v2-chat-send');
  function submit() { if (input && input.value.trim()) { say(input.value.trim()); input.value = ''; } }
  if (send) send.addEventListener('click', submit);
  if (input) input.addEventListener('keydown', function (e) { if (e.key === 'Enter') submit(); });
})();

/* ---------- Region toggle + live DA tracker (single state, geo-defaulted) ---------- */
if (document.getElementById('v2-region') && document.getElementById('v2-feed')) {
  (function () {
    var regions = {
      sa: {
        label: 'South Australia',
        stats: ['36,911', '1,548', '119'],
        pool: [
          { title: 'Verandah & carport', council: 'City of Onkaparinga' },
          { title: 'Swimming pool & safety barrier', council: 'City of Playford' },
          { title: 'Dwelling additions & alterations', council: 'City of Salisbury' },
          { title: 'Two-storey dwelling', council: 'City of Charles Sturt' },
          { title: 'Garage conversion & studio', council: 'City of Tea Tree Gully' },
          { title: 'Retaining wall & fencing', council: 'Mount Barker District' }
        ]
      },
      qld: {
        label: 'Gold Coast',
        stats: ['3,930', '410', '94'],
        pool: [
          { title: 'Two-storey dwelling', council: 'Gold Coast City' },
          { title: 'Dwelling additions & alterations', council: 'Gold Coast City' },
          { title: 'Secondary dwelling', council: 'Gold Coast City' },
          { title: 'Swimming pool & safety barrier', council: 'Gold Coast City' },
          { title: 'Duplex development', council: 'Gold Coast City' }
        ]
      }
    };
    var region = 'sa';
    var feedTick = 0;
    var feedEl = document.getElementById('v2-feed');

    function esc(s) {
      return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function renderFeed() {
      var pool = regions[region].pool;
      var html = '';
      for (var i = 0; i < 4; i++) {
        var it = pool[(feedTick + i) % pool.length];
        var badge = i < 2
          ? '<span style="font-size:10.5px;font-weight:700;letter-spacing:1.5px;color:#2C7A5B;border:1px solid #2C7A5B;border-radius:5px;padding:3px 8px;flex-shrink:0">NEW</span>'
          : '';
        html += '<div style="display:flex;align-items:flex-start;gap:12px;padding:15px 20px;border-bottom:1px solid #EAE8DE">'
          + '<span style="color:#2C7A5B;font-weight:700">&rsaquo;</span>'
          + '<div style="flex:1;font-size:13px;line-height:1.55;color:#6B6252">'
          + '<span style="color:#1E2A38;font-weight:700">' + esc(it.title) + '</span> &mdash; ' + esc(it.council) + ' &middot; lodged this week</div>'
          + badge + '</div>';
      }
      feedEl.innerHTML = html;
    }

    function applyRegion() {
      var r = regions[region];
      for (var i = 0; i < 3; i++) {
        var statEl = document.getElementById('v2-stat-' + i);
        if (statEl) statEl.textContent = r.stats[i];
      }
      var labels = document.querySelectorAll('.v2-region-label');
      for (var j = 0; j < labels.length; j++) labels[j].textContent = r.label;
      feedTick = 0;
      renderFeed();
    }

    var regionSel = document.getElementById('v2-region');
    var nearTag = document.getElementById('v2-near-tag');
    var detectedRegion = null;
    function updateNearTag() {
      if (!nearTag) return;
      nearTag.style.display = (detectedRegion && region === detectedRegion) ? 'inline-block' : 'none';
    }
    regionSel.addEventListener('change', function () {
      region = this.value;
      applyRegion();
      updateNearTag();
    });

    applyRegion();

    /* Geo-locate (by IP, no permission prompt): default to the visitor's state
       — Gold Coast (QLD) if in Queensland, otherwise South Australia. */
    (function () {
      try {
        fetch('https://get.geojs.io/v1/ip/geo.json')
          .then(function (r) { if (!r.ok) throw 0; return r.json(); })
          .then(function (d) {
            var st = String((d && d.region) || '');
            var qld = String((d && d.country_code) || '').toUpperCase() === 'AU' &&
              (/queensland/i.test(st) || st.toUpperCase() === 'QLD');
            var detected = qld ? 'qld' : 'sa';
            detectedRegion = detected;
            if (detected !== region) { region = detected; regionSel.value = detected; applyRegion(); }
            updateNearTag();
          })
          .catch(function () { /* keep SA default */ });
      } catch (e) { /* keep SA default */ }
    })();

    setInterval(function () { feedTick++; renderFeed(); }, 3500);
  })();
}

/* ---------- Pricing: monthly / yearly toggle ---------- */
if (document.getElementById('v2-subscribe')) {
  (function () {
    var baseFeatures = [
      '14-day free trial — no credit card required',
      'Target the council areas you want to work in',
      'Your digital business card delivered directly to real developments',
      'Exclusive placement within a capped list of up to 14 businesses per council',
      'Transparent monthly reporting with full visibility of every delivery'
    ];
    var check = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2C7A5B" stroke-width="2.4" style="flex-shrink:0;margin-top:2px"><path d="M5 12.5l4.5 4.5L19 7"></path></svg>';
    var featuresEl = document.getElementById('v2-pricing-features');
    var monthlyBtn = document.getElementById('v2-bill-monthly');
    var yearlyBtn = document.getElementById('v2-bill-yearly');
    var savingsEl = document.getElementById('v2-savings');

    function esc(s) {
      return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function renderPricing(yearly) {
      var feats = baseFeatures.concat(yearly ? [] : ['Cancel anytime']);
      var html = '';
      for (var i = 0; i < feats.length; i++) {
        html += '<div style="display:flex;align-items:flex-start;gap:12px;font-size:14.5px;line-height:1.5;color:#2A3542;padding:13px 0;border-bottom:1px solid #F0EBE0">'
          + check + esc(feats[i]) + '</div>';
      }
      if (featuresEl) featuresEl.innerHTML = html;

      var priceMain = document.getElementById('v2-price-main');
      var priceUnit = document.getElementById('v2-price-unit');
      var pricingSub = document.getElementById('v2-pricing-sub');
      var subscribe = document.getElementById('v2-subscribe');

      if (priceMain) priceMain.textContent = yearly ? '$990' : '$99';
      if (priceUnit) priceUnit.textContent = yearly ? ' /year' : ' /month';
      if (pricingSub) {
        pricingSub.textContent = yearly
          ? 'Get ahead of the competition with DAconnect. No hidden fees.'
          : 'Get ahead of the competition with DAconnect. No hidden fees, cancel anytime.';
      }
      if (savingsEl) savingsEl.style.display = yearly ? 'inline-block' : 'none';
      if (subscribe) {
        subscribe.href =
          'https://app.daconnect.com.au/subscription?exclusive&occurrence=' + (yearly ? 'yearly' : 'monthly');
      }

      if (monthlyBtn) {
        monthlyBtn.style.background = yearly ? 'transparent' : '#2C7A5B';
        monthlyBtn.style.color = yearly ? '#3A4653' : '#fff';
      }
      if (yearlyBtn) {
        yearlyBtn.style.background = yearly ? '#2C7A5B' : 'transparent';
        yearlyBtn.style.color = yearly ? '#fff' : '#3A4653';
      }
    }

    if (monthlyBtn) monthlyBtn.addEventListener('click', function () { renderPricing(false); });
    if (yearlyBtn) yearlyBtn.addEventListener('click', function () { renderPricing(true); });
    renderPricing(false);
  })();
}

/* ---------- Preview-only form buttons (not wired to a backend) ---------- */
if (document.getElementById('v2-trial-btn')) {
  (function () {
    var b = document.getElementById('v2-trial-btn');
    b.addEventListener('click', function () { b.textContent = 'THANKS — CHECK YOUR INBOX'; });
  })();
}

if (document.getElementById('v2-sample-btn2')) {
  (function () {
    var b = document.getElementById('v2-sample-btn2');
    b.addEventListener('click', function () { b.textContent = 'Thanks — check your inbox'; });
  })();
}

if (document.getElementById('v2-contact-btn')) {
  (function () {
    var b = document.getElementById('v2-contact-btn');
    b.addEventListener('click', function () { b.textContent = 'Message Sent — Thank You'; });
  })();
}
