// Runs before Angular to avoid showing English before a first-visit redirect.
(() => {
  const currentIsKannada = document.documentElement.lang.toLowerCase().startsWith('kn');
  // An explicit Kannada URL takes precedence over device preferences.
  if (currentIsKannada) return;
  let preference;
  try {
    preference = localStorage.getItem('namo-language');
  } catch {
    // Device detection and language links work without storage.
  }
  const deviceLanguage = navigator.languages?.[0] || navigator.language || 'en';
  const useKannada =
    preference === 'kn' ||
    (preference !== 'en' && deviceLanguage.toLowerCase().split('-')[0] === 'kn');
  if (!useKannada) return;
  const target = new URL('kn/', document.baseURI);
  target.search = location.search;
  target.hash = location.hash;
  if (target.pathname !== location.pathname) location.replace(target.href);
})();
