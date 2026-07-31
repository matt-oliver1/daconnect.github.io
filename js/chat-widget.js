/*
 * Tawk.to live chat widget.
 *
 * Kept in one file rather than inlined per page so the embed id lives in a
 * single place. Loaded on every public page.
 *
 * The widget itself renders inside a cross-origin iframe, so nothing inside it
 * can be styled from here. The attention pulse below is therefore drawn as our
 * own element sitting behind the bubble, not applied to the bubble itself.
 */
var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();

(function () {
  'use strict';

  var GLOW_ID = 'dac-chat-glow';

  function injectGlowStyles() {
    if (document.getElementById(GLOW_ID + '-styles')) return;
    var css =
      '#' + GLOW_ID + '{position:fixed;' +
      'right:var(--dac-chat-glow-right,20px);bottom:var(--dac-chat-glow-bottom,20px);' +
      'width:var(--dac-chat-glow-size,60px);height:var(--dac-chat-glow-size,60px);' +
      'border-radius:50%;pointer-events:none;z-index:1999999998;' +
      'animation:dacChatGlow 2.2s ease-out infinite;}' +
      '#' + GLOW_ID + '.dac-glow-off{display:none;}' +
      '@keyframes dacChatGlow{' +
      '0%{box-shadow:0 0 0 0 rgba(45,123,91,.55),0 0 18px 4px rgba(45,123,91,.35);}' +
      '70%{box-shadow:0 0 0 18px rgba(45,123,91,0),0 0 26px 6px rgba(45,123,91,.15);}' +
      '100%{box-shadow:0 0 0 0 rgba(45,123,91,0),0 0 18px 4px rgba(45,123,91,.35);}}' +
      '@media (prefers-reduced-motion:reduce){#' + GLOW_ID + '{animation:none;}}';
    var style = document.createElement('style');
    style.id = GLOW_ID + '-styles';
    style.textContent = css;
    document.head.appendChild(style);
  }

  function glow() {
    return document.getElementById(GLOW_ID);
  }

  function addGlow() {
    if (glow()) return;
    injectGlowStyles();
    var el = document.createElement('div');
    el.id = GLOW_ID;
    el.setAttribute('aria-hidden', 'true');
    document.body.appendChild(el);
  }

  function setGlowVisible(visible) {
    var el = glow();
    if (el) el.classList.toggle('dac-glow-off', !visible);
  }

  // Tawk fires onLoad once the widget is actually on the page.
  Tawk_API.onLoad = function () {
    addGlow();
  };

  // No point pulsing for attention while the chat is already open.
  Tawk_API.onChatMaximized = function () { setGlowVisible(false); };
  Tawk_API.onChatMinimized = function () { setGlowVisible(true); };
  Tawk_API.onChatHidden = function () { setGlowVisible(false); };
  Tawk_API.onChatStarted = function () { setGlowVisible(false); };

  var s1 = document.createElement('script'),
      s0 = document.getElementsByTagName('script')[0];
  s1.async = true;
  s1.src = 'https://embed.tawk.to/6a6ca0c29e9ec71d4836d331/1jus57tvj';
  s1.charset = 'UTF-8';
  s1.setAttribute('crossorigin', '*');
  s0.parentNode.insertBefore(s1, s0);
})();
