import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { User, UserRole, StudentProfile, CompanyProfile } from '@/types';
import {
  loginUser,
  logoutUser,
  getCurrentUser,
  registerUser,
  addStudentProfile,
  addCompanyProfile,
  getStudentProfile,
  getCompanyProfile,
} from '@/data/mockStore';

interface AuthContextType {
  user: User | null;
  profile: StudentProfile | CompanyProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (email: string, password: string, role: UserRole) => Promise<User>;
  updateProfile: (profileData: StudentProfile | CompanyProfile) => void;
  refreshProfile: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(getCurrentUser());
  const [profile, setProfile] = useState<StudentProfile | CompanyProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const refreshProfile = useCallback(() => {
    if (user) {
      if (user.role === 'student') {
        setProfile(getStudentProfile(user.id) || null);
      } else if (user.role === 'company') {
        setProfile(getCompanyProfile(user.id) || null);
      } else {
        setProfile(null);
      }
    }
  }, [user]);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const loggedInUser = loginUser(email, password);
      if (loggedInUser) {
        setUser(loggedInUser);
        if (loggedInUser.role === 'student') {
          setProfile(getStudentProfile(loggedInUser.id) || null);
        } else if (loggedInUser.role === 'company') {
          setProfile(getCompanyProfile(loggedInUser.id) || null);
        } else {
          setProfile(null);
        }
        return true;
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    logoutUser();
    setUser(null);
    setProfile(null);
  }, []);

  const register = useCallback(async (email: string, password: string, role: UserRole): Promise<User> => {
    setIsLoading(true);
    try {
      const newUser = registerUser(email, password, role);
      setUser(newUser);
      return newUser;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfile = useCallback((profileData: StudentProfile | CompanyProfile) => {
    if (profileData) {
      if ('usn' in profileData) {
        addStudentProfile(profileData as StudentProfile);
      } else {
        addCompanyProfile(profileData as CompanyProfile);
      }
      setProfile(profileData);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        register,
        updateProfile,
        refreshProfile,
      }}
    >
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
