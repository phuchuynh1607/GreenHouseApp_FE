import React, { useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  loginUser,
  fetchUserProfile,
  registerUser,
} from "../services/auth.service";
import { tokenStorage } from "../tokenStorage/tokenStorage";

export const Providers = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = await tokenStorage.getAccessToken();

      if (token) {
        try {
          const userProfile = await fetchUserProfile();
          setUser(userProfile);
        } catch (error) {
          console.error("Auto login failed:", error);
          if (error.response?.status === 401) {
            await tokenStorage.clearTokens();
          }
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const login = async (username, password) => {
    try {
      const data = await loginUser({ username, password });
      if (data?.access_token) {
        await tokenStorage.setTokens(data.access_token, data.refresh_token);

        const userProfile = await fetchUserProfile();
        setUser(userProfile);
        return data;
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const register = async (userData) => {
    return await registerUser(userData);
  };

  const logout = async () => {
    await tokenStorage.clearTokens();
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const userProfile = await fetchUserProfile();
      setUser(userProfile);
    } catch (error) {
      console.error("Refresh user failed", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, isLoading, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
