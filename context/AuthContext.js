import React, { createContext, useState, useEffect, useContext } from 'react';
import { login as apiLogin, register as apiRegister, logout as apiLogout } from '../api/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        const token = await AsyncStorage.getItem('authToken');
        
        if (userData && token) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUser();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await apiLogin(credentials);
      
      // Debug log to see what we're getting
      console.log('AuthContext login response:', response);
      
      // Handle different response structures
      const token = response?.token || response?.data?.token;
      const userData = response?.user || response?.data?.user || response?.data;
      
      if (!token) {
        throw new Error('No token received from server');
      }
      
      await AsyncStorage.setItem('authToken', token);
      if (userData) {
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
      }
      
      return response;
    } catch (error) {
      console.error('Login error in AuthContext:', error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await apiRegister(userData);
      
      // Debug log to see what we're getting
      console.log('AuthContext register response:', response);
      
      // Handle different response structures
      const token = response?.token || response?.data?.token;
      const userInfo = response?.user || response?.data?.user || response?.data;
      
      if (!token) {
        throw new Error('No token received from server');
      }
      
      await AsyncStorage.setItem('authToken', token);
      if (userInfo) {
        await AsyncStorage.setItem('user', JSON.stringify(userInfo));
        setUser(userInfo);
      }
      
      return response;
    } catch (error) {
      console.error('Register error in AuthContext:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiLogout();
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout API fails, clear local data
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};