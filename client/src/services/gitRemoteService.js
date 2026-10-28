const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

async function request(options = {}) {
  const response = await fetch(`${API_BASE_URL}/api/settings/git-remote`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.message || "Unable to update Git remote");
  }

  return result;
}

const gitRemoteService = {
  get: () => request(),

  save: (gitRemote) =>
    request({
      method: "PUT",
      body: JSON.stringify(gitRemote),
    }),

  remove: () =>
    request({
      method: "DELETE",
    }),
};

export default gitRemoteService;
