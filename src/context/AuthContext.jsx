import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

// Configure Axios Defaults globally for Cookie transmission
axios.defaults.baseURL = "https://bharat-backend-63qv.onrender.com";
axios.defaults.withCredentials = true;

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Synchronize authentication status on startup
  const checkLoginStatus = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/v1/users/me", {
        withCredentials: true,
      });
      if (res.data && res.data.data && res.data.data.data) {
        setUser(res.data.data.data);
      }
    } catch (err) {
      // User is not logged in; clean up session
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  // Signup new user
  const signup = async (name, email, password, passwordConfirm) => {
    try {
      setError(null);
      setLoading(true);
      const res = await axios.post(
        "/api/v1/users/signup",
        {
          name,
          email,
          password,
          passwordConfirm,
        },
        {
          withCredentials: true,
        },
      );
      if (res.data && res.data.data && res.data.data.user) {
        setUser(res.data.data.user);
      }
      return res.data;
    } catch (err) {
      const errMsg = err.response?.data?.message || "Failed to sign up";
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // Login existing user
  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      const res = await axios.post(
        "/api/v1/users/login",
        { email, password },
        {
          withCredentials: true,
        },
      );
      if (res.data && res.data.data && res.data.data.user) {
        setUser(res.data.data.user);
      }
      return res.data;
    } catch (err) {
      const errMsg = err.response?.data?.message || "Failed to log in";
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = async () => {
    try {
      setLoading(true);
      await axios.get("/api/v1/users/logout");
      setUser(null);
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Update profile attributes (FormData supports photo files)
  const updateProfile = async (formData) => {
    try {
      setError(null);
      setLoading(true);
      const res = await axios.patch("/api/v1/users/updateMe", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.data && res.data.data && res.data.data.user) {
        setUser(res.data.data.user);
      }
      return res.data;
    } catch (err) {
      const errMsg = err.response?.data?.message || "Failed to update profile";
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // Trigger manual sync
  const refetchMe = async () => {
    await checkLoginStatus();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        signup,
        login,
        logout,
        updateProfile,
        refetchMe,
        setError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
