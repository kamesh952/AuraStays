import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Basic password hashing (for demo only - use bcrypt in production)
  const hashPassword = (password) => {
    return btoa(unescape(encodeURIComponent(password)));
  };

  // Initialize sample data
  const initializeData = () => {
    if (!localStorage.getItem('hotelUsers')) {
      const sampleUsers = [
        {
          id: uuidv4(),
          name: 'Admin User',
          email: 'admin@example.com',
          password: hashPassword('admin123'),
          role: 'admin',
          createdAt: new Date().toISOString(),
          lastLogin: null
        }
      ];
      localStorage.setItem('hotelUsers', JSON.stringify(sampleUsers));
    }
  };

  // Check auth status on mount
  useEffect(() => {
    initializeData();
    const user = localStorage.getItem('hotelUser');
    if (user) {
      try {
        setCurrentUser(JSON.parse(user));
      } catch (error) {
        localStorage.removeItem('hotelUser');
      }
    }
    setLoading(false);
  }, []);

  const login = async ({ email, password }) => {
    const users = JSON.parse(localStorage.getItem('hotelUsers')) || [];
    const user = users.find(u => 
      u.email === email && 
      u.password === hashPassword(password)
    );
    
    if (!user) throw new Error('Invalid credentials');

    const updatedUser = {
      ...user,
      lastLogin: new Date().toISOString()
    };

    localStorage.setItem('hotelUser', JSON.stringify(updatedUser));
    setCurrentUser(updatedUser);
    return updatedUser;
  };

  const register = async ({ name, email, password }) => {
    // Validation
    if (!name || !email || !password) throw new Error('All fields required');
    if (password.length < 6) throw new Error('Password too short');
    
    const users = JSON.parse(localStorage.getItem('hotelUsers')) || [];
    if (users.some(u => u.email === email)) throw new Error('Email exists');

    const newUser = {
      id: uuidv4(),
      name,
      email,
      password: hashPassword(password),
      role: 'user',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };

    const updatedUsers = [...users, newUser];
    localStorage.setItem('hotelUsers', JSON.stringify(updatedUsers));
    localStorage.setItem('hotelUser', JSON.stringify(newUser));
    setCurrentUser(newUser);
    return newUser;
  };

  const logout = () => {
    localStorage.removeItem('hotelUser');
    setCurrentUser(null);
    navigate('/login');
  };

  const updateProfile = async (updates) => {
    if (!currentUser) throw new Error('Not authenticated');
    
    const users = JSON.parse(localStorage.getItem('hotelUsers')) || [];
    const updatedUsers = users.map(u => 
      u.id === currentUser.id ? { ...u, ...updates } : u
    );
    
    const updatedUser = updatedUsers.find(u => u.id === currentUser.id);
    localStorage.setItem('hotelUsers', JSON.stringify(updatedUsers));
    localStorage.setItem('hotelUser', JSON.stringify(updatedUser));
    setCurrentUser(updatedUser);
    return updatedUser;
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      login,
      register,
      logout,
      updateProfile,
      loading
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// Custom hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}