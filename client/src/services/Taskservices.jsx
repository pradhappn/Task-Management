
import { getAuthToken } from "./api";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

async function request(path, options = {}) {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (response.status === 204) return null;

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      result.message || `Request failed with status ${response.status}`
    );
  }

  return result && typeof result === "object" && "data" in result
    ? result.data
    : result;
}

const taskService = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== "" && value !== undefined && value !== null) {
        params.set(key, String(value));
      }
    });

    const query = params.toString();
    const result = await request(
      `/api/tasks${query ? `?${query}` : ""}`
    );

    const tasks = Array.isArray(result) ? result : result?.tasks;

    if (!Array.isArray(tasks)) {
      throw new Error("The server returned an invalid task list.");
    }

    return {
      tasks,
      pagination: result?.pagination ?? {
        currentPage: 1,
        pageSize: tasks.length,
        totalTasks: tasks.length,
        totalPages: tasks.length ? 1 : 0,
      },
    };
  },

  getStats: async () => {
    const result = await request("/api/tasks/stats");
    return result.stats;
  },

  getById: (id) => request(`/api/tasks/${id}`),

  create: (task) =>
    request("/api/tasks", {
      method: "POST",
      body: JSON.stringify(task),
    }),

  update: (id, updates) =>
    request(`/api/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    }),

  remove: (id) =>
    request(`/api/tasks/${id}`, {
      method: "DELETE",
    }),
};

export default taskService;
