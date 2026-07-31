/*
 * Tawk.to live chat widget.
 *
 * Kept in one file rather than inlined per page so the embed id lives in a
 * single place. Loaded on every public page.
 */
var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();

(function () {
  var s1 = document.createElement('script'),
      s0 = document.getElementsByTagName('script')[0];
  s1.async = true;
  s1.src = 'https://embed.tawk.to/6a6ca0c29e9ec71d4836d331/1jus57tvj';
  s1.charset = 'UTF-8';
  s1.setAttribute('crossorigin', '*');
  s0.parentNode.insertBefore(s1, s0);
})();
