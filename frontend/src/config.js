// API Base URL: Uses VITE_API_BASE_URL in production (e.g. Railway URL), or empty string in local dev (proxied by Vite)
export const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
