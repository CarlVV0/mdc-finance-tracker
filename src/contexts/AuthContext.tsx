
import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from "sonner";

// Define the User type
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  date: string;
}

// Define the AuthContext type
interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => boolean;
  signup: (name: string, email: string, password: string) => boolean;
  logout: () => void;
  forgotPassword: (email: string) => boolean;
  resetPassword: (email: string, newPassword: string) => boolean;
  updateProfile: (updates: Partial<User>) => boolean;
  changePassword: (oldPassword: string, newPassword: string) => boolean;
  isAdmin: () => boolean;
}

// Create the AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize localStorage with an admin user if it doesn't exist
  useEffect(() => {
    // Check if users exist in localStorage
    const existingUsers = localStorage.getItem('users');
    if (!existingUsers) {
      // Create initial admin user
      const adminUser: User = {
        id: '1',
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin',
        date: new Date().toISOString(),
      };
      
      // Save to localStorage
      localStorage.setItem('users', JSON.stringify([adminUser]));
    }
    
    // Check if there's a logged-in user session
    const loggedInUser = localStorage.getItem('currentUser');
    if (loggedInUser) {
      setCurrentUser(JSON.parse(loggedInUser));
    }
    
    setLoading(false);
  }, []);

  // Login function
  const login = (email: string, password: string): boolean => {
    const users = JSON.parse(localStorage.getItem('users') || '[]') as User[];
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      toast.success(`Welcome back, ${user.name}!`);
      return true;
    } else {
      toast.error('Invalid email or password');
      return false;
    }
  };

  // Signup function
  const signup = (name: string, email: string, password: string): boolean => {
    const users = JSON.parse(localStorage.getItem('users') || '[]') as User[];
    
    // Check if email already exists
    if (users.some(u => u.email === email)) {
      toast.error('Email already in use');
      return false;
    }
    
    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      password,
      role: 'user', // Default role is user
      date: new Date().toISOString(),
    };
    
    // Add to users array and save
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    toast.success('Account created successfully! You can now log in.');
    return true;
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    toast.info('You have been logged out');
  };

  // Forgot password function (simplified for localStorage)
  const forgotPassword = (email: string): boolean => {
    const users = JSON.parse(localStorage.getItem('users') || '[]') as User[];
    const user = users.find(u => u.email === email);
    
    if (user) {
      // In a real app, this would send a reset email
      // For our localStorage demo, we'll just show a success message
      toast.success('Password reset link sent to your email');
      return true;
    } else {
      toast.error('Email not found');
      return false;
    }
  };

  // Reset password function
  const resetPassword = (email: string, newPassword: string): boolean => {
    const users = JSON.parse(localStorage.getItem('users') || '[]') as User[];
    const userIndex = users.findIndex(u => u.email === email);
    
    if (userIndex >= 0) {
      users[userIndex].password = newPassword;
      localStorage.setItem('users', JSON.stringify(users));
      toast.success('Password has been reset');
      return true;
    } else {
      toast.error('Email not found');
      return false;
    }
  };

  // Update profile function
  const updateProfile = (updates: Partial<User>): boolean => {
    if (!currentUser) {
      toast.error('No user logged in');
      return false;
    }
    
    const users = JSON.parse(localStorage.getItem('users') || '[]') as User[];
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    
    if (userIndex >= 0) {
      // Update user in the array
      const updatedUser = { ...users[userIndex], ...updates };
      users[userIndex] = updatedUser;
      
      // Save back to localStorage
      localStorage.setItem('users', JSON.stringify(users));
      
      // Update current user state and localStorage
      setCurrentUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      toast.success('Profile updated successfully');
      return true;
    } else {
      toast.error('User not found');
      return false;
    }
  };

  // Change password function
  const changePassword = (oldPassword: string, newPassword: string): boolean => {
    if (!currentUser) {
      toast.error('No user logged in');
      return false;
    }
    
    if (currentUser.password !== oldPassword) {
      toast.error('Current password is incorrect');
      return false;
    }
    
    return updateProfile({ password: newPassword });
  };

  // Check if user is admin
  const isAdmin = (): boolean => {
    return currentUser?.role === 'admin';
  };

  // Return the provider
  return (
    <AuthContext.Provider value={{
      currentUser,
      loading,
      login,
      signup,
      logout,
      forgotPassword,
      resetPassword,
      updateProfile,
      changePassword,
      isAdmin,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Create a hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
