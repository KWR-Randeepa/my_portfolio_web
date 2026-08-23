// Central API base URL config.
// In production (Vercel), set VITE_API_URL to your deployed backend URL.
// e.g. https://your-backend.vercel.app
// In development, falls back to local server.
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default API_BASE_URL;
