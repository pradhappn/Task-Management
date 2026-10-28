
const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
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
    return request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(formData),
    });
  },

  async login(credentials) {
    return request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  async getMe() {
    return request("/api/auth/me");
  },

  async logout() {
    return request("/api/auth/logout", {
      method: "POST",
    });
  },
};

export default authService;
