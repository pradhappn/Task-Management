
import { getAuthToken, setAuthToken } from "./api";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

async function request(path, options = {}) {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.message || "Request failed");
  }

  return result;
}

const authService = {
  async register(formData) {
    const result = await request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(formData),
    });
    setAuthToken(result.token);
    return result;
  },

  async login(credentials) {
    const result = await request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    setAuthToken(result.token);
    return result;
  },

  async getMe() {
    return request("/api/auth/me");
  },

  async logout() {
    try {
      return await request("/api/auth/logout", {
        method: "POST",
      });
    } finally {
      setAuthToken(null);
    }
  },
};

export default authService;
