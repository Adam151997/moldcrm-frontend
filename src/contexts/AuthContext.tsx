import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { authAPI } from '../services/api';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      authAPI.getProfile()
        .then(response => setUser(response.data))
        .catch(() => localStorage.removeItem('authToken'))
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting login with:', { email, password });
      
      // 🚨 CRITICAL FIX: Use "username" field instead of "email"
      const response = await authAPI.login({ username: email, password });
      console.log('Login response:', response.data);
      
      const { token, user_id, email: userEmail, first_name, last_name, role } = response.data;
      
      if (!token) {
        throw new Error('No authentication token received');
      }
      
      // Store token and set user
      localStorage.setItem('authToken', token);
      
      // Create user object from response
      const user: User = {
        id: user_id,
        email: userEmail,
        first_name: first_name,
        last_name: last_name,
        role: role,
        phone: '',
        department: '',
        account: 1 // Default account ID
      };
      
      setUser(user);
      console.log('Login successful, user set:', user);
      
    } catch (error: any) {
      console.error('Login failed:', error);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.detail || 
                          error.response?.data?.non_field_errors?.[0] ||
                          error.message ||
                          'Login failed. Please check your credentials.';
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};