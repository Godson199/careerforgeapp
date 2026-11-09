const form = document.querySelector('#cf-application-form');

if (form) {
  const typeSelect = form.elements.applicationType;
  const internshipFields = document.querySelector('#cf-internship-fields');
  const cvInput = form.elements.cv;
  const portfolioInput = form.elements.portfolioUrl;
  const linkedinInput = form.elements.linkedinUrl;
  const errorMessage = document.querySelector('#cf-apply-error');
  const submitButton = document.querySelector('#cf-apply-submit');
  const paymentSection = document.querySelector('#cf-apply-payment');
  const paymentSummary = document.querySelector('#cf-apply-payment-summary');
  const paymentButton = document.querySelector('#cf-apply-pay');
  const paymentError = document.querySelector('#cf-apply-payment-error');
  let applicationId;

  const requestedType = new URLSearchParams(window.location.search).get('type');
  if (requestedType === 'Training' || requestedType === 'Internship') {
    typeSelect.value = requestedType;
  }

  function updateApplicationType() {
    const internship = typeSelect.value === 'Internship';
    internshipFields.hidden = !internship;
    cvInput.disabled = !internship;
    cvInput.required = internship;
    portfolioInput.disabled = !internship;
    portfolioInput.required = internship;
    linkedinInput.disabled = !internship;
    linkedinInput.required = internship;
  }

  function showError(element, message) {
    element.textContent = message;
    element.hidden = false;
  }

  typeSelect.addEventListener('change', updateApplicationType);
  updateApplicationType();

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    errorMessage.hidden = true;
    if (!form.reportValidity()) return;

    if (cvInput.files[0] && cvInput.files[0].size > 5 * 1024 * 1024) {
      showError(errorMessage, 'Your CV must be 5MB or smaller.');
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = 'Submitting…';
    try {
      const response = await fetch(`${window.CF_API_BASE}${window.CF_ENDPOINTS.apply}`, {
        method: 'POST',
        body: new FormData(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Unable to submit your application.');

      applicationId = data.application_id;
      paymentSummary.textContent =
        `Application ID: ${applicationId}. Payment required: ₦${(data.payment_amount / 100).toLocaleString('en-NG')}.`;
      form.hidden = true;
      paymentSection.hidden = false;
    } catch (error) {
      showError(errorMessage, error.message || 'Unable to reach the application service. Please try again.');
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'Continue to payment';
    }
  });

  paymentButton.addEventListener('click', async () => {
    paymentError.hidden = true;
    paymentButton.disabled = true;
    paymentButton.textContent = 'Opening payment…';
    try {
      const response = await fetch(
        `${window.CF_API_BASE}/api/payment/initialize/${applicationId}`,
        { method: 'POST' },
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Unable to start payment.');
      if (!data.authorizationUrl) throw new Error('The payment service did not return a checkout link.');
      window.location.assign(data.authorizationUrl);
    } catch (error) {
      showError(paymentError, error.message || 'Unable to reach the payment service. Please try again.');
      paymentButton.disabled = false;
      paymentButton.textContent = 'Proceed to payment';
    }
  });
}
