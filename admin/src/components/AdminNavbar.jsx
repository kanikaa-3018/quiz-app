import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { GraduationCap, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAdmin } from '../context/AdminContext'; 

const AdminNavbar = () => {
  const { adminData, isAuthenticated, signOut } = useAdmin();
  const [location, setLocation] = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const handleSignOut = () => {
    signOut();
    setShowDropdown(false);
    setLocation('/admin/login');
  };

  const getInitials = () => {
    if (!adminData) return '?';
    const name = adminData.name || '';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-blue-600 flex items-center">
              <GraduationCap className="inline mr-2" />
              Tinker Tutor Admin
            </h1>
          </div>

          {/* Navigation */}
          
            <div className="flex items-center space-x-8">
              <nav className="hidden md:flex space-x-6">
                <Link
                  href="/admin/dashboard"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/student-stats"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Students
                </Link>
                <Link
                  href="/admin/profile"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Profile
                </Link>
              </nav>

              {/* Profile dropdown */}
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center focus:outline-none"
                >
                  {adminData?.profileImage ? (
                    <img
                      src={adminData.profileImage}
                      alt="Admin"
                      className="w-10 h-10 rounded-full object-cover border-2 border-blue-400"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                      {getInitials()}
                    </div>
                  )}
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
                    <Link
                      href="/admin/profile"
                      className="block px-4 py-2 text-gray-800 hover:bg-blue-50"
                      onClick={() => setShowDropdown(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      href="/admin/dashboard"
                      className="block px-4 py-2 text-gray-800 hover:bg-blue-50"
                      onClick={() => setShowDropdown(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-blue-50"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
