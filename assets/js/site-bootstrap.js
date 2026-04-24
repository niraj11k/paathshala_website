/* Site root from window.location (works on localhost, production, subpaths, file://). Injects app CSS. */
(function () {
  function computeRoot() {
    if (typeof window.__PAATHSHALA_SITE_ROOT__ === 'string' && window.__PAATHSHALA_SITE_ROOT__) {
      var preset = window.__PAATHSHALA_SITE_ROOT__;
      return /\/$/.test(preset) ? preset : preset + '/';
    }
    var u = new URL(window.location.href);
    var p = u.pathname.split('/').filter(Boolean);
    if (p.length && /\.html?$/i.test(p[p.length - 1])) {
      p.pop();
    }
    if (p.length) {
      p.pop();
    }
    u.pathname = '/' + (p.length ? p.join('/') + '/' : '');
    var href = u.href;
    if (!/\/$/.test(href)) {
      href += '/';
    }
    return href;
  }

  var root = computeRoot();
  window.__PAATHSHALA_SITE_ROOT__ = root;

  function injectCss(relPath) {
    if (!relPath) return;
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = root + String(relPath).replace(/^\//, '');
    document.head.appendChild(link);
  }

  injectCss('assets/css/style.css');
  var extra = document.documentElement.getAttribute('data-page-css');
  if (extra) {
    extra.split(',').forEach(function (part) {
      injectCss(part.trim());
    });
  }
})();
