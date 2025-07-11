import React, { useState } from 'react';
import { useLocation } from 'wouter';
import AdminForm from '../components/AdminForm';
import API from '../lib/api';
import axios from 'axios'

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [, setLocation] = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/api/admin/login', formData);
      localStorage.setItem('adminToken', res.data.token);
      setLocation('/admin/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return <AdminForm type="login" formData={formData} setFormData={setFormData} handleSubmit={handleSubmit} />;
};

export default AdminLogin;
