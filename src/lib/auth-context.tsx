"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { users } from "@/data/users";
import { schools } from "@/data/schools";
import type { User, Role, School } from "@/lib/types";

interface AuthContextType {
  currentUser: User | null;
  currentRole: Role | null;
  currentSchool: School | null;
  login: (userId: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  currentRole: null,
  currentSchool: null,
  login: () => {},
  logout: () => {},
  isLoading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUserId = localStorage.getItem("amisa-user-id");
    if (savedUserId) {
      const user = users.find((u) => u.id === savedUserId);
      if (user) setCurrentUser(user);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem("amisa-user-id", userId);
    }
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem("amisa-user-id");
  }, []);

  const currentRole = currentUser?.role ?? null;
  const currentSchool = currentUser?.schoolId
    ? schools.find((s) => s.id === currentUser.schoolId) ?? null
    : null;

  return (
    <AuthContext.Provider
      value={{ currentUser, currentRole, currentSchool, login, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
