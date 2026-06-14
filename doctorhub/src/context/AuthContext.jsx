import React, { createContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get('/auth/me');
        if (res.data.success) {
          setCurrentUser(res.data.data);
        }
      } catch (err) {
        console.error(err);
        localStorage.removeItem('token');
        toast.error('Session expired. Please log in again.');
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('token', token);
    setCurrentUser(userData);
    toast.success('Logged in successfully');
    
    const dest = `/${userData.role}/dashboard`;
    navigate(userData.role === 'super_admin' ? '/superadmin/dashboard' : dest);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
