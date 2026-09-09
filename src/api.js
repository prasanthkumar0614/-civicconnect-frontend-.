/**
 * src/api.js
 * Thin fetch wrapper around the CivicConnect Django REST API (see backend/).
 * Stores the JWT access token in memory + localStorage so a refresh doesn't
 * force a re-login during development.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";const MEDIA_ORIGIN = BASE_URL.replace(/\/api\/?$/, "");
export function mediaUrl(path) {
  if (!path) return null;
  return path.startsWith("http") ? path : `${MEDIA_ORIGIN}${path}`;
}

let accessToken = localStorage.getItem("cc_access_token") || null;

export function setToken(token) {
  accessToken = token;
  if (token) localStorage.setItem("cc_access_token", token);
  else localStorage.removeItem("cc_access_token");
}

export function getToken() {
  return accessToken;
}

async function request(path, { method = "GET", body, isMultipart = false } = {}) {
  const headers = {};
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
  if (!isMultipart) headers["Content-Type"] = "application/json";

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? (isMultipart ? body : JSON.stringify(body)) : undefined,
  });

  if (!res.ok) {
    let detail = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      detail = data.detail || JSON.stringify(data);
    } catch {
      /* response wasn't JSON */
    }
    throw new Error(detail);
  }

  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  login: (username, password) =>
    request("/auth/login/", { method: "POST", body: { username, password } }),
  register: (payload) => request("/auth/register/", { method: "POST", body: payload }),
  me: () => request("/auth/me/"),

  areaTree: () => request("/areas/tree/"),
  assetsForArea: (areaId) => request(`/assets/picker/?area=${areaId}`),

  myIssues: () => request("/issues/"),
  issueDetail: (id) => request(`/issues/${id}/`),
  submitIssue: (payload) => request("/issues/", { method: "POST", body: payload }),
  uploadPhoto: (issueId, formData) =>
    request(`/issues/${issueId}/upload_photo/`, {
      method: "POST",
      body: formData,
      isMultipart: true,
    }),
};
