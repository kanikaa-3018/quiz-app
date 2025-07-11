import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useUser } from '../context/UserContext';

const DashboardNavbar = () => {
  const { userData, signOut } = useUser();
  const [location, setLocation] = useLocation(); // `setLocation` replaces `useNavigate`
  const [showDropdown, setShowDropdown] = useState(false);
  
  const isActive = (path) => {
    return location === path ? 'bg-blue-600 text-white' : 'text-gray-800 hover:bg-blue-50';
  };

  const handleSignOut = () => {
    signOut();
    setShowDropdown(false);
    setLocation('/'); // navigate to home
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const getInitials = () => {
    if (!userData) return "?";
    return `${userData?.firstName?.charAt(0)}${userData?.lastName?.charAt(0)}`;
  };

  return (
    <nav className="flex items-center justify-between py-4 px-8 bg-white shadow-sm">
      <div className="flex items-center">
        <Link href="/" className="text-2xl font-bold text-blue-500 mr-8 transition-transform hover:scale-105 duration-300">
          Tinker Tutor
        </Link>
        <div className="flex space-x-2">
          <Link 
            href="/dashboard" 
            className={`px-4 py-2 rounded-md font-medium transition-all duration-300 hover:-translate-y-1 ${isActive('/dashboard')}`}
          >
            Dashboard
          </Link>
          <Link 
            href="/take-quiz" 
            className={`px-4 py-2 rounded-md font-medium transition-all duration-300 hover:-translate-y-1 ${isActive('/take-quiz')}`}
          >
            Take Quiz
          </Link>
          <Link 
            href="/reports" 
            className={`px-4 py-2 rounded-md font-medium transition-all duration-300 hover:-translate-y-1 ${isActive('/reports')}`}
          >
            Reports
          </Link>
          <Link 
            href="/profile" 
            className={`px-4 py-2 rounded-md font-medium transition-all duration-300 hover:-translate-y-1 ${isActive('/profile')}`}
          >
            Profile
          </Link>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button className="relative transition-transform hover:scale-110 duration-300">
          <i className="fas fa-bell text-gray-600"></i>
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        <div className="relative">
          <button 
            onClick={toggleDropdown}
            className="flex items-center focus:outline-none transition-transform hover:scale-110 duration-300"
            aria-label="User menu"
          >
            {userData?.profilePicture ? (
              <img 
                src={userData?.profilePicture} 
                alt="Profile" 
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                {getInitials()}
              </div>
            )}
          </button>
          
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-md shadow-lg z-20">
              <Link 
                href="/profile" 
                className="block px-4 py-2 text-gray-800 hover:bg-blue-50"
                onClick={() => setShowDropdown(false)}
              >
                My Profile
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
    </nav>
  );
};

export default DashboardNavbar;
