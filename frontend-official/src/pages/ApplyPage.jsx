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
      <header id="header-part">
        <div className="header-top d-none d-lg-block">
          <div className="container">
            <div className="row">
              <div className="col-lg-6">
                <div className="header-contact text-lg-left text-center">
                  <ul>
                    <li><img src="/images/all-icon/map.png" alt="icon" /><span>Nigeria, Remote, World wide</span></li>
                    <li><img src="/images/all-icon/email.png" alt="icon" /><span>careerforgeanalytics@gmail.com</span></li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="header-opening-time text-lg-right text-center">
                  <p>Live sessions : Monday, Wednesday &amp; Friday</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="header-logo-support pt-30 pb-30">
          <div className="container">
            <div className="row">
              <div className="col-lg-4 col-md-4">
                <div className="logo">
                  <a href="/" aria-label="CareerForge home">
                    <img src="/images/careerforge-logo.png" alt="CareerForge" />
                  </a>
                </div>
              </div>
              <div className="col-lg-8 col-md-8">
                <div className="support-button float-right d-none d-md-block">
                  <div className="support float-left">
                    <div className="icon"><img src="/images/all-icon/support.png" alt="icon" /></div>
                    <div className="cont">
                      <p>Questions? Talk to us</p>
                      <span>+2349137373718</span>
                    </div>
                  </div>
                  <div className="button float-left">
                    <a href="/apply?type=Training" className="main-btn">Apply Now</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="navigation">
          <div className="container">
            <div className="row">
              <div className="col-lg-10 col-md-10 col-sm-9 col-8">
                <nav className="navbar navbar-expand-lg">
                  <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="icon-bar" />
                    <span className="icon-bar" />
                    <span className="icon-bar" />
                  </button>
                  <div className="collapse navbar-collapse sub-menu-bar" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto">
                      <li className="nav-item">
                        <a className="active" href="/">Home</a>
                        <ul className="sub-menu">
                          <li><a className="active" href="/">Home 01</a></li>
                          <li><a href="/">Home 02</a></li>
                          <li><a href="/">Home 03</a></li>
                        </ul>
                      </li>
                      <li className="nav-item"><a href="/about.html">About us</a></li>
                      <li className="nav-item">
                        <a href="/courses.html">Programmes</a>
                        <ul className="sub-menu">
                          <li><a href="/courses.html">Programmes</a></li>
                          <li><a href="/courses-singel.html">Programme Details</a></li>
                        </ul>
                      </li>
                      <li className="nav-item">
                        <a href="/events.html">Events</a>
                        <ul className="sub-menu">
                          <li><a href="/events.html">Events</a></li>
                          <li><a href="/events-singel.html">Event Details</a></li>
                        </ul>
                      </li>
                      <li className="nav-item">
                        <a href="/teachers.html">Our Facilitators</a>
                        <ul className="sub-menu">
                          <li><a href="/teachers.html">Facilitators</a></li>
                          <li><a href="/teachers-singel.html">Facilitator Profile</a></li>
                        </ul>
                      </li>
                      <li className="nav-item">
                        <a href="/blog.html">Blog</a>
                        <ul className="sub-menu">
                          <li><a href="/blog.html">Blog</a></li>
                          <li><a href="/blog-singel.html">Blog Details</a></li>
                        </ul>
                      </li>
                      <li className="nav-item">
                        <a href="/contact.html">Contact</a>
                        <ul className="sub-menu">
                          <li><a href="/contact.html">Contact Us</a></li>
                          <li><a href="/contact-2.html">Contact Us 2</a></li>
                        </ul>
                      </li>
                    </ul>
                  </div>
                </nav>
              </div>
              <div className="col-lg-2 col-md-2 col-sm-3 col-4">
                <div className="right-icon text-right">
                  <ul>
                    <li><a href="/courses.html" aria-label="Search programmes"><i className="fa fa-search" /></a></li>
                    <li><a href="#" aria-label="Shopping bag"><i className="fa fa-shopping-bag" /><span>0</span></a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
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
              <div className="btn-group w-100 mb-3" role="group" aria-label="Application type">
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
                <div className="form-row">
                  <div className="form-group col-md-6">
                    <label htmlFor="fullName">Full name</label>
                    <input className="form-control" id="fullName" name="name" type="text" autoComplete="name" required />
                  </div>
                  <div className="form-group col-md-6">
                    <label htmlFor="email">Email address</label>
                    <input className="form-control" id="email" name="email" type="email" autoComplete="email" required />
                  </div>
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
                <div className="form-row">
                  <div className="form-group col-md-6">
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
                  <div className="form-group col-md-6">
                    <label htmlFor="track">Track</label>
                    <select className="form-control" id="track" name="track" value={track} onChange={(event) => setTrack(event.target.value)} required>
                      {tracks.map((item) => <option key={item} value={item}>{item}</option>)}
                    </select>
                  </div>
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
                    <div className="form-row">
                      <div className="form-group col-md-6">
                        <label htmlFor="portfolioUrl">GitHub / Portfolio URL</label>
                        <input className="form-control" id="portfolioUrl" name="portfolioUrl" type="url" placeholder="https://" required />
                      </div>
                      <div className="form-group col-md-6">
                        <label htmlFor="linkedinUrl">LinkedIn URL</label>
                        <input className="form-control" id="linkedinUrl" name="linkedinUrl" type="url" placeholder="https://" required />
                      </div>
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
      <footer id="footer-part">
        <div className="footer-top pt-40 pb-70">
          <div className="container">
            <div className="row">
              <div className="col-lg-4 col-md-6">
                <div className="footer-about mt-40">
                  <div className="logo">
                    <a href="/" aria-label="CareerForge home">
                      <img src="/images/careerforge-logo-light.png" alt="CareerForge" />
                    </a>
                  </div>
                  <p>Real job simulations, expert facilitators and live projects that turn learning into employment.</p>
                  <ul className="mt-20">
                    <li><a href="#" aria-label="Facebook"><i className="fa fa-facebook-f" /></a></li>
                    <li><a href="#" aria-label="Twitter"><i className="fa fa-twitter" /></a></li>
                    <li><a href="#" aria-label="Google Plus"><i className="fa fa-google-plus" /></a></li>
                    <li><a href="#" aria-label="Instagram"><i className="fa fa-instagram" /></a></li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-sm-6">
                <div className="footer-link mt-40">
                  <div className="footer-title pb-25"><h6>Sitemap</h6></div>
                  <ul>
                    <li><a href="/"><i className="fa fa-angle-right" />Home</a></li>
                    <li><a href="/about.html"><i className="fa fa-angle-right" />About us</a></li>
                    <li><a href="/courses.html"><i className="fa fa-angle-right" />Programmes</a></li>
                    <li><a href="/blog.html"><i className="fa fa-angle-right" />News</a></li>
                    <li><a href="/events.html"><i className="fa fa-angle-right" />Event</a></li>
                  </ul>
                  <ul>
                    <li><a href="#"><i className="fa fa-angle-right" />Gallery</a></li>
                    <li><a href="#"><i className="fa fa-angle-right" />Merch</a></li>
                    <li><a href="/teachers.html"><i className="fa fa-angle-right" />Facilitators</a></li>
                    <li><a href="#"><i className="fa fa-angle-right" />Support</a></li>
                    <li><a href="/contact.html"><i className="fa fa-angle-right" />Contact</a></li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-2 col-md-6 col-sm-6">
                <div className="footer-link support mt-40">
                  <div className="footer-title pb-25"><h6>Support</h6></div>
                  <ul>
                    <li><a href="#"><i className="fa fa-angle-right" />FAQS</a></li>
                    <li><a href="#"><i className="fa fa-angle-right" />Privacy</a></li>
                    <li><a href="#"><i className="fa fa-angle-right" />Policy</a></li>
                    <li><a href="#"><i className="fa fa-angle-right" />Support</a></li>
                    <li><a href="#"><i className="fa fa-angle-right" />Documentation</a></li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="footer-address mt-40">
                  <div className="footer-title pb-25"><h6>Contact Us</h6></div>
                  <ul>
                    <li>
                      <div className="icon"><i className="fa fa-home" /></div>
                      <div className="cont"><p>Nigeria, Remote, World wide</p></div>
                    </li>
                    <li>
                      <div className="icon"><i className="fa fa-phone" /></div>
                      <div className="cont"><p>+2349137373718</p></div>
                    </li>
                    <li>
                      <div className="icon"><i className="fa fa-envelope-o" /></div>
                      <div className="cont"><p>careerforgeanalytics@gmail.com</p></div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-copyright pt-10 pb-25">
          <div className="container">
            <div className="row">
              <div className="col-md-8">
                <div className="copyright text-md-left text-center pt-15">
                  <p><a href="/">CareerForge Analytics</a></p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="copyright text-md-right text-center pt-15" />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
