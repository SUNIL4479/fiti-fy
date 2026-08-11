const DEFAULT_API_BASE_URL = import.meta.env.DEV
  ? "http://localhost:5000/api"
  : "https://fiti-fy.onrender.com/api";
// Temporary override: force the deployed backend URL to isolate rewrite/env issues.
// Remove this override after verification so `VITE_API_BASE_URL` or rewrites can be used again.
const API_BASE_URL = import.meta.env.DEV
  ? "http://localhost:5000/api"
  : "https://fiti-fy.onrender.com/api";

export const apiUrl = (path: string): string =>
  `${API_BASE_URL}/${path.replace(/^\//, "")}`;

export const apiFetch = (path: string, init?: RequestInit): Promise<Response> =>
  fetch(apiUrl(path), {
    credentials: "include",
    ...init,
  });