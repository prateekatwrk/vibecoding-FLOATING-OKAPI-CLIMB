"use client";

import * as React from "react";

interface AuthContextProps {
  isAuthenticated: boolean;
  login: (id: string, password: string) => void;
  logout: () => void;
  userId: string | null;
}

const AuthContext = React.createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [userId, setUserId] = React.useState<string | null>(null);

  React.useEffect(() => {
    const savedUserId = localStorage.getItem("dyad-user-id");

    if (savedUserId) {
      setUserId(savedUserId);
      setIsAuthenticated(true);
    }
  }, []);

  const login = (id: string, password: string) => {
    if (id && password) {
      setUserId(id);
      setIsAuthenticated(true);
      localStorage.setItem("dyad-user-id", id);
    }
  };

  const logout = () => {
    setUserId(null);
    setIsAuthenticated(false);
    localStorage.removeItem("dyad-user-id");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, userId }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = React.useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};