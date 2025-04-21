
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Simple user type for our authentication system
export type User = {
  id: string;
  name: string;
  email: string;
  role: "student" | "teacher" | "admin";
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Predefined credentials
const PREDEFINED_CREDENTIALS = [
  {
    email: "admin@eduarch.com",
    password: "admin123",
    user: {
      id: "1",
      name: "Admin User",
      email: "admin@eduarch.com",
      role: "admin" as const
    }
  },
  {
    email: "teacher@eduarch.com", 
    password: "teacher123",
    user: {
      id: "2",
      name: "Teacher User",
      email: "teacher@eduarch.com",
      role: "teacher" as const
    }
  },
  {
    email: "student@eduarch.com",
    password: "student123",
    user: {
      id: "3",
      name: "Student User",
      email: "student@eduarch.com",
      role: "student" as const
    }
  }
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Check if user is logged in from localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  // Updated login function with predefined credentials
  const login = async (email: string, password: string) => {
    console.log("Logging in with:", email, password);
    
    // Find matching credentials
    const matchedCredential = PREDEFINED_CREDENTIALS.find(
      cred => cred.email === email && cred.password === password
    );

    if (matchedCredential) {
      setUser(matchedCredential.user);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(matchedCredential.user));
    } else {
      throw new Error("Invalid credentials");
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
