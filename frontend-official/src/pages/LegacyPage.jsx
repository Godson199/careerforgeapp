import { useEffect, useMemo } from 'react';

const legacyScripts = [
  '/js/vendor/modernizr-3.6.0.min.js',
  '/js/vendor/jquery-1.12.4.min.js',
  '/js/bootstrap.min.js',
  '/js/slick.min.js',
  '/js/jquery.magnific-popup.min.js',
  '/js/waypoints.min.js',
  '/js/jquery.counterup.min.js',
  '/js/jquery.nice-select.min.js',
  '/js/jquery.nice-number.min.js',
  '/js/jquery.countdown.min.js',
  '/js/validator.min.js',
  '/js/ajax-contact.js',
  '/js/main.js',
];

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[data-legacy-src="${src}"]`);
    if (existing?.dataset.loaded === 'true') {
      resolve();
      return;
    }

    const script = existing || document.createElement('script');
    script.src = src;
    script.dataset.legacySrc = src;
    script.addEventListener('load', () => {
      script.dataset.loaded = 'true';
      resolve();
    }, { once: true });
    script.addEventListener('error', () => reject(new Error(`Unable to load site script: ${src}`)), { once: true });
    if (!existing) document.body.appendChild(script);
  });
}

export default function LegacyPage({ markup }) {
  const { bodyMarkup, title } = useMemo(() => {
    const parsed = new DOMParser().parseFromString(markup, 'text/html');
    parsed.querySelectorAll('script, #cf-chat-btn, #cf-chat').forEach((element) => element.remove());
    parsed.querySelector('.preloader')?.remove();
    return {
      bodyMarkup: parsed.body.innerHTML,
      title: parsed.title || 'CareerForge Analytics',
    };
  }, [markup]);

  useEffect(() => {
    document.title = title;
  }, [title]);

  useEffect(() => {
    let active = true;
    async function initializeTemplate() {
      for (const script of legacyScripts) {
        await loadScript(script);
        if (!active) return;
      }
    }
    initializeTemplate().catch((error) => console.error(error));
    return () => {
      active = false;
    };
  }, [markup]);

  return <div className="cf-legacy-page" dangerouslySetInnerHTML={{ __html: bodyMarkup }} />;
}
