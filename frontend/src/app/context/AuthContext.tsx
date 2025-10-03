"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface User {
  email: string;
  username: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // ✅ Load user info from localStorage on mount
 
  // ✅ Login: Save each piece of data separately
  const login = (userData: User) => {
    localStorage.setItem("email", userData.email);
    localStorage.setItem("username", userData.username);
    localStorage.setItem("token", btoa(userData.token)); // encode token

    setUser(userData);
  };

  // ✅ Logout: Clear all stored info
  const logout = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
