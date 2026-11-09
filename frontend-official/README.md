# CareerForge site (React + Vite)

React application built with Vite, retaining the existing Edubin-template
pages as reusable content under `src/legacy-pages/`.

    npm install
    npm run dev       # http://localhost:5173
    npm run build     # outputs dist/
    npm run preview

- `index.html` mounts the React app. `src/App.jsx` selects the page from the current URL; legacy site pages render through `src/pages/LegacyPage.jsx`.
- `src/pages/ApplyPage.jsx` handles application submission and Paystack checkout. `src/pages/PaymentSuccessPage.jsx` verifies payments and displays a receipt. Shared UI and API wiring live in `src/components/ChatWidget.jsx` and `src/config.js`.
- The existing HTML content is preserved in `src/legacy-pages/`; legacy links such as `/about.html` continue to resolve through the Vercel SPA rewrite.
- `public/` holds the template's CSS, jQuery plugins, images and fonts, served as-is (they rely on globals, so they are not bundled).
- API settings live in `.env` (copy `.env.example`): `VITE_API_BASE`. Homepage Apply links open the React `/apply` page and pass the selected application type.
- Deploy on Vercel: framework Vite, build `npm run build`, output `dist`. The included `vercel.json` sends app routes and legacy `.html` links to the React entry point.
- Set the backend's `FRONTEND_URL` to this site's deployed origin so Paystack returns to `/payment-success`. Set `VITE_GOOGLE_CLASSROOM_URL` in the frontend build environment if you want to show the classroom link on verified receipts.
