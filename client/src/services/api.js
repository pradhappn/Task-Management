
const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

let authToken = null;

export const setAuthToken = (token) => {
  authToken = token;
};

export const apiRequest = async (endpoint, options = {}) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(authToken
        ? { Authorization: `Bearer ${authToken}` }
        : {}),
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
};
