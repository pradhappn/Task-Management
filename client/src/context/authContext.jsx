
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import authService from "../services/authServices";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadUser() {
      try {
        const result = await authService.getMe();

        if (active) {
          setUser(result.user);
        }
      } catch {
        if (active) {
          setUser(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadUser();

    return () => {
      active = false;
    };
  }, []);

  async function login(credentials) {
    const result = await authService.login(credentials);
    setUser(result.user);
    return result.user;
  }

  async function register(formData) {
    const result = await authService.register(formData);
    setUser(result.user);
    return result.user;
  }

  async function logout() {
    await authService.logout();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
