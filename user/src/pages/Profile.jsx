import { useState } from 'react';
import DashboardNavbar from '../components/DashboardNavbar';
import EditProfileModal from '../components/EditProfileModal';
import { useUser } from '../context/UserContext';

const Profile = () => {
  const { userData, updateUserData } = useUser();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handlePreferenceChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // For checkboxes, use the checked value, otherwise use the input value
    const newValue = type === 'checkbox' ? checked : value;
    
    // Update the user preferences
    updateUserData({
      preferences: {
        ...userData.preferences,
        [name]: newValue
      }
    });
  };

  // Function to get initials from name
  const getInitials = () => {
    if (!userData) return "?";
    return `${userData.firstName.charAt(0)}${userData.lastName.charAt(0)}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Card */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">My Profile</h1>
              <button 
                onClick={() => setIsEditModalOpen(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md flex items-center hover:bg-blue-600 transition-colors"
              >
                <i className="fas fa-edit mr-2"></i>
                Edit Profile
              </button>
            </div>
            
            <div className="md:flex">
              <div className="md:w-1/3 flex flex-col items-center mb-6 md:mb-0">
                {userData?.profilePicture ? (
                  <div className="w-32 h-32 rounded-full overflow-hidden mb-4">
                    <img 
                      src={userData.profilePicture} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-semibold mb-4">
                    {getInitials()}
                  </div>
                )}
                <h2 className="text-xl font-semibold">{userData.firstName} {userData.lastName}</h2>
                <p className="text-gray-600">Class {userData.class} - {userData.stream}</p>
              </div>
              
              <div className="md:w-2/3 md:pl-8">
                <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                    <div className="mt-1 p-2 bg-gray-100 rounded-md">{userData.firstName}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                    <div className="mt-1 p-2 bg-gray-100 rounded-md">{userData.lastName}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email Address</label>
                    <div className="mt-1 p-2 bg-gray-100 rounded-md">{userData.email}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Class</label>
                    <div className="mt-1 flex">
                      <div className="relative w-full">
                        <select defaultValue={userData.class} className="block w-full p-2 bg-gray-100 border-gray-300 rounded-md appearance-none pr-8">
                          <option>Class {userData.class}</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                          <i className="fas fa-chevron-down"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Stream</label>
                    <div className="mt-1 flex">
                      <div className="relative w-full">
                        <select defaultValue={userData.stream} className="block w-full p-2 bg-gray-100 border-gray-300 rounded-md appearance-none pr-8">
                          <option>{userData.stream}</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                          <i className="fas fa-chevron-down"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <div className="mt-1 p-2 bg-gray-100 rounded-md">{userData.phone}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Learning Preferences */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold mb-6">Learning Preferences</h3>
            
            <div className="mb-6">
              <p className="block text-sm font-medium text-gray-700 mb-2">Preferred Quiz Duration</p>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input 
                    type="radio" 
                    id="duration-15" 
                    name="quizDuration" 
                    value="15"
                    checked={userData.preferences.quizDuration === "15"}
                    onChange={handlePreferenceChange}
                    className="w-4 h-4 text-blue-600"
                  />
                  <label htmlFor="duration-15" className="ml-2">15 minutes</label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="radio" 
                    id="duration-30" 
                    name="quizDuration" 
                    value="30"
                    checked={userData.preferences.quizDuration === "30"}
                    onChange={handlePreferenceChange}
                    className="w-4 h-4 text-blue-600"
                  />
                  <label htmlFor="duration-30" className="ml-2">30 minutes</label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="radio" 
                    id="duration-60" 
                    name="quizDuration" 
                    value="60"
                    checked={userData.preferences.quizDuration === "60"}
                    onChange={handlePreferenceChange}
                    className="w-4 h-4 text-blue-600"
                  />
                  <label htmlFor="duration-60" className="ml-2">60 minutes</label>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="block text-sm font-medium text-gray-700 mb-2">Difficulty Level</p>
              <div className="relative inline-block w-48">
                <select 
                  name="difficultyLevel"
                  value={userData.preferences.difficultyLevel}
                  onChange={handlePreferenceChange}
                  className="block w-full p-2 bg-gray-100 border border-gray-300 rounded-md appearance-none pr-8"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <i className="fas fa-chevron-down"></i>
                </div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="notifications" 
                  name="notifications"
                  checked={userData.preferences.notifications}
                  onChange={handlePreferenceChange}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <label htmlFor="notifications" className="ml-2">Send email notifications for quiz reminders</label>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </div>
  );
};

export default Profile;