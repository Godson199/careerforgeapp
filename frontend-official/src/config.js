// Backend wiring: set VITE_API_BASE in .env (see .env.example).
window.CF_API_BASE = import.meta.env.VITE_API_BASE || 'https://careerforge-new-api.onrender.com'
window.CF_ENDPOINTS = {
  bot: import.meta.env.VITE_BOT_PATH || '/api/bot/chat',
  apply: import.meta.env.VITE_APPLY_PATH || '/api/apply',
  contact: import.meta.env.VITE_CONTACT_PATH || '/api/contact',
}
