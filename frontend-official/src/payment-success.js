const checking = document.querySelector('#cf-payment-checking');

if (checking) {
  const pending = document.querySelector('#cf-payment-pending');
  const failed = document.querySelector('#cf-payment-failed');
  const success = document.querySelector('#cf-payment-success');
  const errorMessage = document.querySelector('#cf-payment-error');
  const classroomLink = document.querySelector('#cf-classroom-link');
  const classroomUnconfigured = document.querySelector('#cf-classroom-unconfigured');

  function showState(state) {
    checking.hidden = state !== 'checking';
    pending.hidden = state !== 'pending';
    failed.hidden = state !== 'failed';
    success.hidden = state !== 'success';
  }

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

  function setReceiptValue(id, value) {
    document.querySelector(id).textContent = value == null ? '\u2014' : String(value);
  }

  async function verifyPayment() {
    const params = new URLSearchParams(window.location.search);
    const reference = params.get('reference') || params.get('trxref');
    if (!reference) {
      showState('failed');
      return;
    }

    try {
      const response = await fetch(
        `${window.CF_API_BASE}/api/payment/verify/${encodeURIComponent(reference)}`,
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Payment could not be verified.');

      if (data.paymentStatus) {
        setReceiptValue('#receipt-application-id', data.application?.id);
        setReceiptValue('#receipt-name', data.application?.name);
        setReceiptValue('#receipt-email', data.application?.email);
        setReceiptValue('#receipt-amount', formatNaira(data.payment?.amount));
        setReceiptValue('#receipt-reference', data.payment?.reference);
        setReceiptValue('#receipt-date', formatDate(data.payment?.paidAt));

        if (import.meta.env.VITE_GOOGLE_CLASSROOM_URL) {
          classroomLink.href = import.meta.env.VITE_GOOGLE_CLASSROOM_URL;
          classroomLink.hidden = false;
        } else {
          classroomUnconfigured.hidden = false;
        }
        showState('success');
      } else if (['failed', 'abandoned', 'mismatch'].includes(data.status)) {
        showState('failed');
      } else {
        showState('pending');
      }
    } catch (error) {
      showState('failed');
      errorMessage.textContent = error.message || 'Payment could not be verified. Please contact support.';
      errorMessage.hidden = false;
    }
  }

  verifyPayment();
}
