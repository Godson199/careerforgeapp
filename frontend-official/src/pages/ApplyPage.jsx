import { useState } from 'react';
import { API_BASE } from '../config.js';

const tracks = ['Data', 'Product', 'Software', 'Design'];

function getInitialValue(key, fallback) {
  const value = new URLSearchParams(window.location.search).get(key);
  return value || fallback;
}

function matchValue(value, options, fallback) {
  const match = options.find((option) => (
    option.toLowerCase() === value.toLowerCase()
      || value.toLowerCase().includes(option.toLowerCase())
  ));
  return match || fallback;
}

export default function ApplyPage() {
  const initialType = matchValue(
    getInitialValue('type', getInitialValue('applicationType', 'Training')),
    ['Training', 'Internship'],
    'Training',
  );
  const initialTrack = matchValue(getInitialValue('track', 'Data'), tracks, 'Data');
  const [applicationType, setApplicationType] = useState(initialType);
  const [track, setTrack] = useState(initialTrack);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [application, setApplication] = useState(null);
  const [startingPayment, setStartingPayment] = useState(false);

  async function submitApplication(event) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    const cv = form.elements.cv?.files?.[0];
    if (applicationType === 'Internship' && cv && cv.size > 5 * 1024 * 1024) {
      setError('Your CV file is larger than 5MB. Please upload a smaller file.');
      return;
    }

    setError('');
    setSubmitting(true);
    const formData = new FormData(form);
    formData.set('applicationType', applicationType);
    formData.set('track', track);
    try {
      const response = await fetch(`${API_BASE}/api/apply`, { method: 'POST', body: formData });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Unable to submit your application.');
      setApplication(data);
    } catch (requestError) {
      setError(requestError.message || 'Unable to reach the application service. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  async function proceedToPayment() {
    setError('');
    setStartingPayment(true);
    try {
      const response = await fetch(`${API_BASE}/api/payment/initialize/${application.application_id}`, {
        method: 'POST',
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Unable to start payment.');
      if (!data.authorizationUrl) throw new Error('The payment service did not return a checkout link.');
      window.location.assign(data.authorizationUrl);
    } catch (requestError) {
      setError(requestError.message || 'Unable to reach the payment service. Please try again.');
    } finally {
      setStartingPayment(false);
    }
  }

  return (
    <div className="cf-apply-page">
      <header className="cf-apply-header">
        <a href="/" aria-label="CareerForge home">
          <img src="/images/careerforge-logo.png" alt="CareerForge" />
        </a>
        <a href="/" className="main-btn">Back to home</a>
      </header>
      <main className="cf-apply-main">
        <section className="cf-apply-card" aria-labelledby="apply-title">
          {application ? (
            <div className="text-center py-4">
              <h1 className="h5 mb-3">Application submitted successfully.</h1>
              <p className="mb-2">Application ID: <strong>{application.application_id}</strong></p>
              <p className="mb-4">
                Payment required: <strong>₦{(application.payment_amount / 100).toLocaleString('en-NG')}</strong>
              </p>
              <button
                type="button"
                className="main-btn cf-apply-submit"
                onClick={proceedToPayment}
                disabled={startingPayment}
              >
                {startingPayment ? 'Opening Payment…' : 'Proceed to Payment'}
              </button>
              {error && <div className="alert alert-danger mt-3 mb-0" role="alert">{error}</div>}
            </div>
          ) : (
            <>
              <h1 id="apply-title">Apply to CareerForge</h1>
              <p className="cf-apply-intro">Tell us a little about yourself to get started.</p>
              <div className="btn-group w-100 mb-4" role="group" aria-label="Application type">
                {['Training', 'Internship'].map((type) => (
                  <button
                    className={`btn ${applicationType === type ? 'btn-primary' : 'btn-outline-dark'}`}
                    type="button"
                    aria-pressed={applicationType === type}
                    key={type}
                    onClick={() => setApplicationType(type)}
                  >
                    {type} Applicant
                  </button>
                ))}
              </div>
              <form onSubmit={submitApplication}>
                <div className="form-group">
                  <label htmlFor="fullName">Full name</label>
                  <input className="form-control" id="fullName" name="name" type="text" autoComplete="name" required />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email address</label>
                  <input className="form-control" id="email" name="email" type="email" autoComplete="email" required />
                </div>
                <div className="form-row">
                  <div className="form-group col-md-6">
                    <label htmlFor="country">Country</label>
                    <select className="form-control" id="country" name="country" defaultValue="Nigeria" required>
                      <option value="Nigeria">Nigeria</option>
                      <option value="Ghana">Ghana</option>
                      <option value="Kenya">Kenya</option>
                      <option value="South Africa">South Africa</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="United States">United States</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="form-group col-md-6">
                    <label htmlFor="state">State / Province</label>
                    <input className="form-control" id="state" name="state" autoComplete="address-level1" required />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="phoneNumber">Phone number</label>
                  <div className="input-group">
                    <select className="form-control cf-country-code" id="countryCode" name="countryCode" defaultValue="+234" aria-label="Country calling code" required>
                      <option value="+234">+234 NG</option>
                      <option value="+233">+233 GH</option>
                      <option value="+254">+254 KE</option>
                      <option value="+27">+27 ZA</option>
                      <option value="+44">+44 UK</option>
                      <option value="+1">+1 US/CA</option>
                    </select>
                    <input className="form-control" id="phoneNumber" name="phoneNumber" type="tel" autoComplete="tel-national" required />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="track">Track</label>
                  <select className="form-control" id="track" name="track" value={track} onChange={(event) => setTrack(event.target.value)} required>
                    {tracks.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="hearAboutUs">How did you hear about us?</label>
                  <select className="form-control" id="hearAboutUs" name="hearAboutUs" defaultValue="" required>
                    <option value="" disabled>Select an option</option>
                    <option value="Social media">Social media</option>
                    <option value="Friend or colleague">Friend or colleague</option>
                    <option value="Search engine">Search engine</option>
                    <option value="Event or community">Event or community</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                {applicationType === 'Internship' && (
                  <fieldset>
                    <legend>Internship requirements</legend>
                    <div className="form-group">
                      <label htmlFor="cv">CV / Resume (PDF or Word document, up to 5MB)</label>
                      <input className="form-control" id="cv" name="cv" type="file" accept=".pdf,.doc,.docx" required />
                    </div>
                    <div className="form-group">
                      <label htmlFor="portfolioUrl">GitHub / Portfolio URL</label>
                      <input className="form-control" id="portfolioUrl" name="portfolioUrl" type="url" placeholder="https://" required />
                    </div>
                    <div className="form-group">
                      <label htmlFor="linkedinUrl">LinkedIn URL</label>
                      <input className="form-control" id="linkedinUrl" name="linkedinUrl" type="url" placeholder="https://" required />
                    </div>
                  </fieldset>
                )}
                <div className="form-group form-check">
                  <input className="form-check-input" id="terms" type="checkbox" required />
                  <label className="form-check-label" htmlFor="terms">I agree to the terms and privacy policy.</label>
                </div>
                {error && <div className="alert alert-danger" role="alert">{error}</div>}
                <button className="main-btn cf-apply-submit" type="submit" disabled={submitting}>
                  {submitting ? 'Submitting…' : 'Continue to payment'}
                </button>
              </form>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
