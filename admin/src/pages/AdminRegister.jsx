import React, { useState } from 'react';
import { useLocation } from 'wouter';
import AdminForm from '../components/AdminForm';
import API from '../lib/api';
import axios from 'axios'

const AdminRegister = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [, setLocation] = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/api/admin/register', formData);
      console.log(res.data);
      
      localStorage.setItem('adminToken', res.data.token);
      //  const { token, admin } = res.data;
      // signIn(admin, token);
      setLocation('/admin/login');
    } catch (err) {
      console.log(err)
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return <AdminForm type="register" formData={formData} setFormData={setFormData} handleSubmit={handleSubmit} />;
};

export default AdminRegister;
