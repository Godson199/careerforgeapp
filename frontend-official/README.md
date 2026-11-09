# CareerForge site (Vite)

Multi-page static site built from the Edubin template, rebranded for CareerForge.

    npm install
    npm run dev       # http://localhost:5173
    npm run build     # outputs dist/
    npm run preview

- `*.html` in the root are the pages (each is auto-registered as a Vite entry). `apply.html` submits applications to the API, and `payment-success.html` verifies Paystack payments and displays the receipt.
- `src/` holds our own code: `careerforge.css` (brand overrides + chat widget), `careerforge.js` (chatbot, apply/contact forms), `config.js` (API wiring).
- `public/` holds the template's CSS, jQuery plugins, images and fonts, served as-is (they rely on globals, so they are not bundled).
- API settings live in `.env` (copy `.env.example`): `VITE_API_BASE`, `VITE_BOT_PATH`, `VITE_APPLY_PATH`, `VITE_CONTACT_PATH`. The homepage Apply links open this site's `apply.html` page and pass the selected application type.
- Deploy on Vercel: framework Vite, build `npm run build`, output `dist`. The included `vercel.json` maps `/apply` and Paystack's `/payment-success` callback to their static HTML pages.
- Set the backend's `FRONTEND_URL` to this site's deployed origin so Paystack returns to `/payment-success`. Set `VITE_GOOGLE_CLASSROOM_URL` in the frontend build environment if you want to show the classroom link on verified receipts.
