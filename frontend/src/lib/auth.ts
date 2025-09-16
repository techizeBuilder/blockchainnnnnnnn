import { useState, useEffect } from "react";
import { toast } from "@/lib/toast";
import axios from "axios";
import Request from "./apiCall";
import api from "@/config/apiRoutes";

interface User {
  email: string;
  id: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

const baseUrl = import.meta.env.VITE_BASE_URL;

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
  });

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("auth_user");
    const token = localStorage.getItem("token");

    if (savedUser && token) {
      try {
        setAuthState({
          user: JSON.parse(savedUser),
          isLoading: false,
          error: null,
        });
      } catch (err) {
        console.error("Failed to parse user:", err);
        localStorage.removeItem("auth_user");
        localStorage.removeItem("token");
        setAuthState({
          user: null,
          isLoading: false,
          error: null,
        });
      }
    } else {
      setAuthState({
        user: null,
        isLoading: false,
        error: null,
      });
    }
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

      const res = await axios.post(`${baseUrl}/auth/register`, { email, password });

      if (res.status === 200) {
        toast.success("User registered successfully");
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return res;
      } else {
        throw new Error("Unexpected response status");
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Failed to create account";
      console.error("Sign up error:", errorMsg);

      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMsg,
      }));

      toast.error(errorMsg);
      return false;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

      const res = await Request.post(api.login, { email, password });

      if (res.status === 200) {
        const user = res.data?.user;
        const token = res.data?.token;

        if (user && token) {
          localStorage.setItem("auth_user", JSON.stringify(user));
          localStorage.setItem("token", token);

          setAuthState({
            user,
            isLoading: false,
            error: null,
          });

          toast.success("Signed in successfully");
          return res;
        } else {
          throw new Error("Invalid response structure");
        }
      } else {
        throw new Error("Login failed");
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Invalid email or password";
      console.error("Login error:", errorMsg);

      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMsg,
      }));

      toast.error(errorMsg);
      return false;
    }
  };

  const signInWithSocial = async (provider: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const user: User = {
        email: `user@${provider.toLowerCase()}.com`,
        id: Math.random().toString(36).substring(2, 9),
      };

      localStorage.setItem("auth_user", JSON.stringify(user));
      localStorage.setItem("token", "mock-social-token");

      setAuthState({
        user,
        isLoading: false,
        error: null,
      });

      toast.success(`Signed in with ${provider}`);
      return true;
    } catch (error) {
      const errorMsg = `Failed to sign in with ${provider}`;

      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMsg,
      }));

      toast.error(errorMsg);
      return false;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setAuthState(prev => ({ ...prev, isLoading: false }));
      toast.success("Password reset link sent");
      return true;
    } catch (error) {
      const errorMsg = "Failed to send password reset link";

      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMsg,
      }));

      toast.error(errorMsg);
      return false;
    }
  };

  const signOut = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

      localStorage.removeItem("auth_user");
      localStorage.removeItem("token");

      setAuthState({
        user: null,
        isLoading: false,
        error: null,
      });

      toast.success("Signed out successfully");
      return true;
    } catch (error) {
      const errorMsg = "Failed to sign out";
      console.error("Sign out error:", error);

      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMsg,
      }));

      toast.error(errorMsg);
      return false;
    }
  };

  return {
    user: authState.user,
    isLoading: authState.isLoading,
    error: authState.error,
    isAuthenticated: !!authState.user,
    signUp,
    signIn,
    signInWithSocial,
    resetPassword,
    signOut,
  };
};
