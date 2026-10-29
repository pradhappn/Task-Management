const AUTH_TOKEN_KEY = "taskflow_token";

export const setAuthToken = (token) => {
  if (token) {
    sessionStorage.setItem(AUTH_TOKEN_KEY, token);
  } else {
    sessionStorage.removeItem(AUTH_TOKEN_KEY);
  }
};

export const getAuthToken = () => sessionStorage.getItem(AUTH_TOKEN_KEY);
