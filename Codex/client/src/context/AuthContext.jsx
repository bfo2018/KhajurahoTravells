import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("khajuraho_token");
    const rawUser = localStorage.getItem("khajuraho_user");

    if (token && rawUser) {
      setUser(JSON.parse(rawUser));
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    const handleExpiredSession = () => {
      localStorage.removeItem("khajuraho_token");
      localStorage.removeItem("khajuraho_user");
      setUser(null);
    };

    window.addEventListener("auth:expired", handleExpiredSession);
    return () => window.removeEventListener("auth:expired", handleExpiredSession);
  }, []);

  const login = async (payload) => {
    const { data } = await api.post("/auth/login", payload);
    localStorage.setItem("khajuraho_token", data.token);
    localStorage.setItem("khajuraho_user", JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const signup = async (payload) => {
    const { data } = await api.post("/auth/signup", payload);
    localStorage.setItem("khajuraho_token", data.token);
    localStorage.setItem("khajuraho_user", JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("khajuraho_token");
    localStorage.removeItem("khajuraho_user");
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, loading, login, signup, logout }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
