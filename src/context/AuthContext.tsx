import { createContext, useState } from 'react';
import type { ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getStoredAuth() {
  try {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      return { token: storedToken, user: JSON.parse(storedUser) as User };
    }
  } catch { /* ignore */ }
  return { token: null, user: null };
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const storedAuth = getStoredAuth();
  const [user, setUser] = useState<User | null>(storedAuth.user);
  const [token, setToken] = useState<string | null>(storedAuth.token);
  const [isLoading] = useState(false);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated: !!token,
      isAdmin: user?.role === 'ADMIN',
      isLoading,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};