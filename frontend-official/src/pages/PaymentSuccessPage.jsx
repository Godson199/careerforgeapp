import { useEffect, useState } from 'react';
import { API_BASE } from '../config.js';

const classroomUrl = import.meta.env.VITE_GOOGLE_CLASSROOM_URL;

function formatNaira(amountKobo) {
  if (typeof amountKobo !== 'number') return '\u2014';
  return `\u20A6${(amountKobo / 100).toLocaleString('en-NG')}`;
}

function formatDate(value) {
  if (!value) return '\u2014';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleString('en-NG', { dateStyle: 'medium', timeStyle: 'short' });
}

export default function PaymentSuccessPage() {
  const [status, setStatus] = useState('checking');
  const [receipt, setReceipt] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const reference = params.get('reference') || params.get('trxref');
    if (!reference) {
      setStatus('failed');
      return;
    }

    fetch(`${API_BASE}/api/payment/verify/${encodeURIComponent(reference)}`)
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || 'Payment could not be verified.');

        if (data.paymentStatus) {
          setReceipt(data);
          setStatus('success');
        } else if (['failed', 'abandoned', 'mismatch'].includes(data.status)) {
          setStatus('failed');
        } else {
          setStatus('pending');
        }
      })
      .catch((requestError) => {
        setError(requestError.message || 'Payment could not be verified. Please contact support.');
        setStatus('failed');
      });
  }, []);

  return (
    <div className="cf-apply-page">
      <header className="cf-apply-header">
        <a href="/" aria-label="CareerForge home">
          <img src="/images/careerforge-logo.png" alt="CareerForge" />
        </a>
        <a href="/" className="main-btn">Back to home</a>
      </header>
      <main className="cf-apply-main">
        <section className="cf-apply-card text-center" aria-live="polite">
          {status === 'checking' && <p className="mb-0">Confirming your payment&hellip;</p>}
          {status === 'pending' && (
            <>
              <h1 className="h5 mb-3">Payment still processing.</h1>
              <p>Paystack hasn&rsquo;t confirmed this transaction yet. You can refresh this page in a minute.</p>
            </>
          )}
          {status === 'failed' && (
            <>
              <h1 className="h5 mb-3">Payment could not be confirmed.</h1>
              <p>If you were charged, please contact support with your payment reference. No payment is recorded until it is verified.</p>
              {error && <div className="alert alert-danger" role="alert">{error}</div>}
              <a href="/apply" className="btn btn-outline-dark">Return to application</a>
            </>
          )}
          {status === 'success' && receipt && (
            <>
              <p className="text-uppercase text-muted small mb-1 font-weight-bold" style={{ letterSpacing: '.08em' }}>CareerForge</p>
              <h1 className="h5 mb-4">Application Payment Receipt</h1>
              <div className="table-responsive">
                <table className="table table-borderless text-left mb-4">
                  <tbody>
                    <tr><td className="text-muted">Application ID</td><td className="text-right font-weight-bold">{receipt.application.id}</td></tr>
                    <tr><td className="text-muted">Applicant Name</td><td className="text-right font-weight-bold">{receipt.application.name}</td></tr>
                    <tr><td className="text-muted">Email</td><td className="text-right font-weight-bold">{receipt.application.email}</td></tr>
                    <tr><td className="text-muted">Amount Paid</td><td className="text-right font-weight-bold">{formatNaira(receipt.payment.amount)}</td></tr>
                    <tr><td className="text-muted">Payment Status</td><td className="text-right font-weight-bold text-success">Successful</td></tr>
                    <tr><td className="text-muted">Payment Reference</td><td className="text-right font-weight-bold">{receipt.payment.reference}</td></tr>
                    <tr><td className="text-muted">Payment Date</td><td className="text-right font-weight-bold">{formatDate(receipt.payment.paidAt)}</td></tr>
                  </tbody>
                </table>
              </div>
              <p className="mb-4">Your application has been successfully registered and your payment has been confirmed.</p>
              <hr className="my-4" />
              <p className="mb-3">Your payment has been confirmed. You can now join the CareerForge classroom.</p>
              {classroomUrl
                ? <a href={classroomUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">Join Google Classroom</a>
                : <p className="text-muted small mb-0">Classroom link is not configured yet.</p>}
            </>
          )}
        </section>
      </main>
    </div>
  );
}
