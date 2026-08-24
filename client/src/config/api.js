// Central API base URL config.
const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000' : '');
// In production (Vercel), set VITE_API_URL to your deployed backend URL.
// e.g. https://your-backend.vercel.app
// In development, falls back to local server.

export default API_BASE_URL;
