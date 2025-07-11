
import React from 'react';
import AdminNavbar from '../components/AdminNavbar'; // Adjust path if needed

const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <main className="p-4">{children}</main>
    </div>
  );
};

export default AdminLayout;
