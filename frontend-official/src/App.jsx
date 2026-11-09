import { useEffect, useState } from 'react';
import ApplyPage from './pages/ApplyPage.jsx';
import ChatWidget from './components/ChatWidget.jsx';
import LegacyPage from './pages/LegacyPage.jsx';
import PaymentSuccessPage from './pages/PaymentSuccessPage.jsx';

const legacyPages = import.meta.glob('./legacy-pages/*.html', {
  import: 'default',
  query: '?raw',
});

function LegacyRoute({ pageName }) {
  const [markup, setMarkup] = useState('');
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    setMarkup('');
    setFailed(false);
    const loadPage = legacyPages[`./legacy-pages/${pageName}.html`];
    if (!loadPage) {
      setFailed(true);
      return () => {
        active = false;
      };
    }

    loadPage()
      .then((pageMarkup) => {
        if (active) setMarkup(pageMarkup);
      })
      .catch((error) => {
        console.error(error);
        if (active) setFailed(true);
      });

    return () => {
      active = false;
    };
  }, [pageName]);

  if (failed) {
    return (
      <main className="cf-apply-main">
        <section className="cf-apply-card">
          <h1>Page not found</h1>
          <a className="main-btn" href="/">Return to CareerForge</a>
        </section>
      </main>
    );
  }
  if (!markup) return <main className="cf-apply-main" aria-live="polite">Loading…</main>;
  return <LegacyPage markup={markup} />;
}

function getCurrentPage() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  if (path === '/apply' || path === '/apply.html') return <ApplyPage />;
  if (path === '/payment-success' || path === '/payment-success.html') return <PaymentSuccessPage />;

  const pageName = path === '/' ? 'index' : path.split('/').pop()?.replace(/\.html$/, '');
  return <LegacyRoute pageName={pageName} />;
}

export default function App() {
  const path = window.location.pathname;
  const isApplyPage = path === '/apply' || path === '/apply.html';
  const isPaymentSuccessPage = path === '/payment-success' || path === '/payment-success.html';
  const showAssistant = path !== '/payment-success' && path !== '/payment-success.html';

  useEffect(() => {
    if (isApplyPage) document.title = 'Apply | CareerForge Analytics';
    if (isPaymentSuccessPage) document.title = 'Payment Receipt | CareerForge Analytics';
  }, [isApplyPage, isPaymentSuccessPage]);

  return (
    <>
      {getCurrentPage()}
      {showAssistant && <ChatWidget />}
    </>
  );
}
