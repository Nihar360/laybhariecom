import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '@/api';
import type { User } from '@/types/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string, mobile: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = authService.getUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authService.login({ email, password });
    if (response.success) {
      setUser({
        id: response.data.id,
        fullName: response.data.fullName,
        email: response.data.email,
        role: response.data.role,
      });
      // Dispatch custom event for cart refresh
      window.dispatchEvent(new Event('auth-changed'));
    } else {
      throw new Error(response.message);
    }
  };

  const register = async (fullName: string, email: string, password: string, mobile: string) => {
    const response = await authService.register({ fullName, email, password, mobile });
    if (response.success) {
      setUser({
        id: response.data.id,
        fullName: response.data.fullName,
        email: response.data.email,
        role: response.data.role,
      });
      // Dispatch custom event for cart refresh
      window.dispatchEvent(new Event('auth-changed'));
    } else {
      throw new Error(response.message);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    // Dispatch custom event for cart clear
    window.dispatchEvent(new Event('auth-changed'));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
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
