import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, userAPI } from '../config/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('accessToken'));

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('accessToken');
      if (storedToken) {
        try {
          const profile = await userAPI.getProfile();
          if (profile?.user) {
            setUser(profile.user);
            setToken(storedToken);
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('accessToken');
          setToken(null);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  // Allows other components to refresh the current user profile (e.g., after editing addresses)
  const refreshProfile = async () => {
    try {
      const profile = await userAPI.getProfile();
      if (profile?.user) setUser(profile.user);
      return profile?.user;
    } catch (err) {
      console.error('Failed to refresh profile:', err);
      return null;
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      if (response.accessToken) {
        localStorage.setItem('accessToken', response.accessToken);
        if (response.refreshToken) {
          localStorage.setItem('refreshToken', response.refreshToken);
        }
        setToken(response.accessToken);
        setUser(response.user);
        return { success: true, user: response.user };
      }
      throw new Error('Login failed');
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const googleLogin = async (googleToken) => {
    try {
      const response = await authAPI.googleLogin(googleToken);
      if (response.accessToken) {
        localStorage.setItem('accessToken', response.accessToken);
        if (response.refreshToken) {
          localStorage.setItem('refreshToken', response.refreshToken);
        }
        setToken(response.accessToken);
        setUser(response.user);
        return { success: true, user: response.user };
      }
      throw new Error('Google Login failed');
    } catch (error) {
        return { success: false, error: error.message };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await authAPI.register({ name, email, password });
      return { success: true, message: response.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setToken(null);
      setUser(null);
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    googleLogin,
    register,
    logout,
    refreshProfile,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
