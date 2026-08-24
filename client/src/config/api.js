// Central API base URL config.
// In production (Vercel), the frontend and API are on the same domain
// (https://my-portfolio-web-opal-iota.vercel.app), so we use an empty
// string to make relative requests (e.g. /api/projects).
// In development, the Vite proxy (vite.config.js) forwards /api to localhost:5000.
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export default API_BASE_URL;
