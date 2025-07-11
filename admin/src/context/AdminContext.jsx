
import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [adminData, setAdminData] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const adminInfo = localStorage.getItem('adminData');

    if (token && adminInfo) {
      setAdminData(JSON.parse(adminInfo));
      setIsAuthenticated(true);
    }
  }, []);

  const signIn = (data, token) => {
    localStorage.setItem('adminToken', token);
    localStorage.setItem('adminData', JSON.stringify(data));
    setAdminData(data);
    setIsAuthenticated(true);
  };

  const signOut = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    setAdminData(null);
    setIsAuthenticated(false);
  };

  return (
    <AdminContext.Provider value={{ adminData, isAuthenticated, signIn, signOut }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
