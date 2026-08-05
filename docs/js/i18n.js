(function () {
  // Each page defines window.TRANSLATIONS = { en: {...}, es: {...}, ko: {...} }

  var STORAGE_KEY = 'jorge-lang';

  function getLang() {
    var saved = '';
    try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) {}
    if (saved && window.TRANSLATIONS[saved]) return saved;
    return 'en';
  }

  function setLang(lang) {
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
    var dict = window.TRANSLATIONS[lang] || {};

    var htmlLang = lang === 'ko' ? 'ko' : (lang === 'es' ? 'es' : 'en');
    if (document.documentElement) document.documentElement.setAttribute('lang', htmlLang);
    if (document.querySelector('meta[name="description"]')) {
      document.querySelector('meta[name="description"]').setAttribute('content', dict.metaDescription || '');
    }

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (dict[key] !== undefined && dict[key] !== null) el.textContent = dict[key];
    });

    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      var spec = el.getAttribute('data-i18n-attr').split('|');
      var key = spec[0], attr = spec[1];
      if (spec.length === 2 && dict[key] !== undefined && dict[key] !== null) {
        el.setAttribute(attr, dict[key]);
      }
    });

    document.querySelectorAll('[data-i18n-lang]').forEach(function (btn) {
      var active = btn.getAttribute('data-i18n-lang') === lang;
      btn.setAttribute('aria-pressed', String(active));
      if (btn.querySelector('.lang-label')) btn.querySelector('.lang-label').textContent = dict.languageName || '';
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-i18n-lang]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setLang(btn.getAttribute('data-i18n-lang'));
      });
    });
    setLang(getLang());
  });

  window.I18N = {
    getLang: getLang,
    apply: setLang
  };
})();