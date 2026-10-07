const panel = document.querySelector('[data-consent-panel]');
const measurementId = panel?.dataset.gaId || '';
const storageKey = 'enterprise-it-fixes-consent-v1';
const maxAge = 180 * 24 * 60 * 60 * 1000;

function readChoice() {
  try {
    const value = JSON.parse(localStorage.getItem(storageKey) || 'null');
    if (!value || Date.now() - value.savedAt > maxAge) return null;
    return value.analytics === true;
  } catch {
    return null;
  }
}

function setGoogleConsent(allowed) {
  if (typeof window.gtag === 'function') {
    window.gtag('consent', 'update', {
      analytics_storage: allowed ? 'granted' : 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });
  }
}

function loadAnalytics() {
  if (!/^G-[A-Z0-9]+$/.test(measurementId) || document.querySelector('[data-google-analytics]')) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function(){ window.dataLayer.push(arguments); };
  window.gtag('consent', 'default', {
    analytics_storage: 'granted',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    functionality_storage: 'granted',
    security_storage: 'granted',
  });
  window.gtag('js', new Date());
  window.gtag('config', measurementId, { send_page_view: true });
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  script.dataset.googleAnalytics = 'true';
  document.head.append(script);
}

function removeAnalyticsCookies() {
  for (const item of document.cookie.split(';')) {
    const name = item.split('=')[0].trim();
    if (!/^_ga(?:_|$)/.test(name)) continue;
    document.cookie = name + '=; Max-Age=0; path=/; SameSite=Lax';
    document.cookie = name + '=; Max-Age=0; path=/; domain=' + location.hostname + '; SameSite=Lax';
  }
}

function saveChoice(allowed) {
  try { localStorage.setItem(storageKey, JSON.stringify({ analytics: allowed, savedAt: Date.now() })); } catch {}
  if (allowed) loadAnalytics();
  else removeAnalyticsCookies();
  setGoogleConsent(allowed);
  if (panel) panel.hidden = true;
}

if (panel && /^G-[A-Z0-9]+$/.test(measurementId)) {
  const choice = readChoice();
  panel.hidden = choice !== null;
  if (choice === true) { loadAnalytics(); setGoogleConsent(true); }
  panel.querySelector('[data-consent-accept]')?.addEventListener('click', () => saveChoice(true));
  panel.querySelector('[data-consent-reject]')?.addEventListener('click', () => saveChoice(false));
  document.querySelector('[data-consent-open]')?.addEventListener('click', () => { panel.hidden = false; });
}
