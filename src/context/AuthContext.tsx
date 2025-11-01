import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  firstName?: string;
  lastName?: string;
  email: string;
  phoneNumber?: string;
  city?: string;
  userTypes?: string[];
  profileImage?: string;
  bio?: string;
  isAuthenticated: boolean;
}

interface ProfileCompletion {
  percentage: number;
  missingFields: string[];
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  getProfileCompletion: () => ProfileCompletion;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        if (userData.isAuthenticated) {
          setUser(userData);
        }
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const getProfileCompletion = (): ProfileCompletion => {
    if (!user) {
      return { percentage: 0, missingFields: [] };
    }

    const requiredFields = [
      { key: 'firstName', label: 'First Name' },
      { key: 'lastName', label: 'Last Name' },
      { key: 'email', label: 'Email' },
      { key: 'phoneNumber', label: 'Phone Number' },
      { key: 'city', label: 'City' },
      { key: 'userTypes', label: 'User Types' },
    ];

    const optionalFields = [
      { key: 'profileImage', label: 'Profile Image' },
      { key: 'bio', label: 'Bio' },
    ];

    const allFields = [...requiredFields, ...optionalFields];
    const missingFields: string[] = [];
    let completedFields = 0;

    allFields.forEach(field => {
      const value = user[field.key as keyof User];
      if (field.key === 'userTypes') {
        if (!value || (Array.isArray(value) && value.length === 0)) {
          missingFields.push(field.label);
        } else {
          completedFields++;
        }
      } else if (!value || (typeof value === 'string' && value.trim() === '')) {
        missingFields.push(field.label);
      } else {
        completedFields++;
      }
    });

    const percentage = Math.round((completedFields / allFields.length) * 100);
    
    return { percentage, missingFields };
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user?.isAuthenticated,
    getProfileCompletion,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};