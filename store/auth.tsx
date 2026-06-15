import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

export interface Address {
  id: string;
  type: 'Home' | 'Work' | 'Other';
  line1: string;
  line2?: string;
  landmark?: string;
}

export interface User {
  phone: string;
  name?: string;
  id: string;
  addresses?: Address[];
  role: 'customer' | 'admin' | 'kitchen' | 'driver';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (phone: string, name?: string, role?: 'customer' | 'admin' | 'kitchen' | 'driver') => Promise<void>;
  logout: () => Promise<void>;
  updateName: (name: string) => Promise<void>;
  addAddress: (address: Omit<Address, 'id'>) => Promise<void>;
  removeAddress: (id: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('auth_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (e) {}
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (phone: string, name?: string, role?: 'customer' | 'admin' | 'kitchen' | 'driver') => {
    try {
      const newUser: User = { 
        phone, 
        name,
        role: role || 'customer',
        id: `usr_${Date.now()}` 
      };
      await AsyncStorage.setItem('auth_user', JSON.stringify(newUser));
      setUser(newUser);
    } catch (e) {}
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('auth_user');
      setUser(null);
    } catch (e) {}
  };

  const updateName = async (name: string) => {
    if (!user) return;
    try {
      const updated = { ...user, name };
      await AsyncStorage.setItem('auth_user', JSON.stringify(updated));
      setUser(updated);
    } catch (e) {}
  };

  const addAddress = async (address: Omit<Address, 'id'>) => {
    if (!user) return;
    try {
      const newAddress: Address = { ...address, id: `addr_${Date.now()}` };
      const updatedAddresses = [...(user.addresses || []), newAddress];
      const updated = { ...user, addresses: updatedAddresses };
      await AsyncStorage.setItem('auth_user', JSON.stringify(updated));
      setUser(updated);
    } catch (e) {}
  };

  const removeAddress = async (id: string) => {
    if (!user) return;
    try {
      const updatedAddresses = (user.addresses || []).filter((a) => a.id !== id);
      const updated = { ...user, addresses: updatedAddresses };
      await AsyncStorage.setItem('auth_user', JSON.stringify(updated));
      setUser(updated);
    } catch (e) {}
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateName, addAddress, removeAddress }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
