import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

interface UserStats {
  height: number;
  weight: number;
  age: number;
  goal: 'weight_loss' | 'muscle_gain' | 'maintenance' | 'endurance';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
}

interface AuthContextType {
  user: User | null;
  userStats: UserStats | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  updateUserStats: (stats: UserStats) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const storedUser = localStorage.getItem('fitfeast_user');
    const storedStats = localStorage.getItem('fitfeast_stats');
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedStats) {
      setUserStats(JSON.parse(storedStats));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Check if user exists in localStorage
    const users = JSON.parse(localStorage.getItem('fitfeast_users') || '[]');
    const existingUser = users.find((u: any) => u.email === email && u.password === password);
    
    if (existingUser) {
      const { password: _, ...userWithoutPassword } = existingUser;
      setUser(userWithoutPassword);
      localStorage.setItem('fitfeast_user', JSON.stringify(userWithoutPassword));
      
      // Load user stats if available
      const statsKey = `fitfeast_stats_${existingUser.id}`;
      const storedStats = localStorage.getItem(statsKey);
      if (storedStats) {
        setUserStats(JSON.parse(storedStats));
        localStorage.setItem('fitfeast_stats', storedStats);
      }
      
      return true;
    }
    
    return false;
  };

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const users = JSON.parse(localStorage.getItem('fitfeast_users') || '[]');
    
    // Check if user already exists
    if (users.some((u: any) => u.email === email)) {
      return false;
    }
    
    const newUser = {
      id: crypto.randomUUID(),
      email,
      password,
      name,
      createdAt: new Date().toISOString(),
    };
    
    users.push(newUser);
    localStorage.setItem('fitfeast_users', JSON.stringify(users));
    
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem('fitfeast_user', JSON.stringify(userWithoutPassword));
    
    return true;
  };

  const logout = () => {
    setUser(null);
    setUserStats(null);
    localStorage.removeItem('fitfeast_user');
    localStorage.removeItem('fitfeast_stats');
  };

  const updateUserStats = (stats: UserStats) => {
    setUserStats(stats);
    localStorage.setItem('fitfeast_stats', JSON.stringify(stats));
    if (user) {
      localStorage.setItem(`fitfeast_stats_${user.id}`, JSON.stringify(stats));
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      userStats,
      isLoading,
      login,
      signup,
      logout,
      updateUserStats,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
