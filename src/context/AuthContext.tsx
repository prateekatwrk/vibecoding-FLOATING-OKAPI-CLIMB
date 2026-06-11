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

  const login = (id: string, password: string) => {
    // placeholder: accept any non‑empty credentials for now
    if (id && password) {
      setIsAuthenticated(true);
      setUserId(id);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserId(null);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, userId }}
    >
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