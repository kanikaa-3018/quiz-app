import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const Navbar = () => {
  const { userData, isAuthenticated, signOut } = useUser();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSignOut = () => {
    signOut();
    setShowDropdown(false);
    navigate('/');
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // Function to get initials from name
  const getInitials = () => {
    if (!userData) return "?";
    return `${userData.firstName.charAt(0)}${userData.lastName.charAt(0)}`;
  };

  return (
    <nav className="flex items-center justify-between py-4 px-8 bg-white shadow-sm">
      <div className="text-2xl font-bold text-blue-500">
        <Link to="/">Tinker Tutor</Link>
      </div>
      
      {isAuthenticated ? (
        <div className="relative">
          <button 
            onClick={toggleDropdown}
            className="flex items-center focus:outline-none"
            aria-label="User menu"
          >
            {userData?.profilePicture ? (
              <img 
                src={userData.profilePicture} 
                alt="Profile" 
                className="w-10 h-10 rounded-full object-cover border-2 border-blue-400"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                {getInitials()}
              </div>
            )}
          </button>
          
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-md shadow-lg z-20">
              <Link 
                to="/dashboard" 
                className="block px-4 py-2 text-gray-800 hover:bg-blue-50"
                onClick={() => setShowDropdown(false)}
              >
                Dashboard
              </Link>
              <Link 
                to="/profile" 
                className="block px-4 py-2 text-gray-800 hover:bg-blue-50"
                onClick={() => setShowDropdown(false)}
              >
                Profile
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
      ) : (
        <div className="space-x-4">
          <Link 
            to="/signin" 
            className="px-4 py-1 text-blue-500 font-medium hover:text-blue-700 transition-colors"
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            className="px-4 py-1 bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600 transition-colors"
          >
            Sign Up
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;