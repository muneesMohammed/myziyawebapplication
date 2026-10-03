"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { loginUser, registerUser, getMe, updateUserProfile, RegisterUserPayload, LoginUserPayload, UpdateUserProfilePayload } from "@/lib/api";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (payload: LoginUserPayload) => Promise<void>;
  register: (payload: RegisterUserPayload) => Promise<void>;
  refreshUser: () => Promise<void>;
  updateProfile: (payload: UpdateUserProfilePayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const persistUser = (nextUser: User | null, nextToken?: string | null) => {
    if (nextUser) {
      localStorage.setItem("myziya_user", JSON.stringify(nextUser));
    } else {
      localStorage.removeItem("myziya_user");
    }

    if (nextToken !== undefined) {
      if (nextToken) {
        localStorage.setItem("myziya_token", nextToken);
      } else {
        localStorage.removeItem("myziya_token");
      }
    }
  };

  useEffect(() => {
    const restoreSession = async () => {
      const savedToken = localStorage.getItem("myziya_token");
      const savedUser = localStorage.getItem("myziya_user");

      if (savedToken) {
        setToken(savedToken);
      }

      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          localStorage.removeItem("myziya_user");
        }
      }

      if (savedToken) {
        try {
          const refreshedUser = await getMe(savedToken);
          setUser(refreshedUser);
          persistUser(refreshedUser, savedToken);
        } catch (e) {
          localStorage.removeItem("myziya_token");
          localStorage.removeItem("myziya_user");
          setToken(null);
          setUser(null);
        }
      }

      setIsLoading(false);
    };

    restoreSession();
  }, []);

  const login = async (payload: LoginUserPayload) => {
    const res = await loginUser(payload);
    const access_token = res.access_token;
    const userData = res.user;

    setToken(access_token);
    setUser(userData);
    persistUser(userData, access_token);
  };

  const register = async (payload: RegisterUserPayload) => {
    const res = await registerUser(payload);
    const access_token = res.access_token;
    const userData = res.user;

    setToken(access_token);
    setUser(userData);
    persistUser(userData, access_token);
  };

  const refreshUser = async () => {
    if (!token) return;

    const refreshedUser = await getMe(token);
    setUser(refreshedUser);
    persistUser(refreshedUser, token);
  };

  const updateProfile = async (payload: UpdateUserProfilePayload) => {
    if (!user || !token) {
      throw new Error("Please sign in to update your account.");
    }

    const updatedUser = await updateUserProfile(user.id, payload, token);
    const nextUser = { ...user, ...payload, ...updatedUser } as User;
    setUser(nextUser);
    persistUser(nextUser, token);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    persistUser(null, null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, refreshUser, updateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
