import { useState } from 'react';
import { useUser } from '../context/UserContext';

const EditProfileModal = ({ isOpen, onClose }) => {
  const { userData, updateUserData } = useUser();
  
  // Create a local state to track form changes
  const [formData, setFormData] = useState({
    firstName: userData?.firstName || '',
    lastName: userData?.lastName || '',
    email: userData?.email || '',
    class: userData?.class || '',
    stream: userData?.stream || '',
    phone: userData?.phone || '',
    profilePicture: userData?.profilePicture || ''
  });
  
  // Track if form is submitting
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // File input reference
  const [imagePreview, setImagePreview] = useState(null);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Function to get initials from name
  const getInitials = () => {
    if (!formData.firstName || !formData.lastName) return "?";
    return `${formData.firstName.charAt(0)}${formData.lastName.charAt(0)}`;
  };
  
  // Handle profile picture change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real app, you would upload this to a server and get back a URL
      // For now, we'll create a local preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // In a real app with backend, this is where you'd make an API call
      // Example: await api.updateUserProfile(userData.id, formData);
      
      // For now, we'll just update the local state
      // Include the new profile picture if one was selected
      const updatedData = {
        ...formData,
        profilePicture: imagePreview || userData.profilePicture
      };
      
      // Update user data in context
      updateUserData(updatedData);
      
      // Close the modal
      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
      // Here you would handle errors, show notifications, etc.
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // If modal is not open, don't render anything
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Edit Profile</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            {/* Profile Picture */}
            <div className="mb-6 flex flex-col items-center">
              {imagePreview || userData?.profilePicture ? (
                <div className="w-32 h-32 rounded-full overflow-hidden mb-4">
                  <img 
                    src={imagePreview || userData.profilePicture} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-32 h-32 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-semibold mb-4">
                  {getInitials()}
                </div>
              )}
              <label className="cursor-pointer bg-blue-100 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-200 transition-colors">
                <span>Change Picture</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageChange}
                />
              </label>
            </div>
            
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input 
                  type="text" 
                  name="firstName" 
                  value={formData.firstName} 
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input 
                  type="text" 
                  name="lastName" 
                  value={formData.lastName} 
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input 
                  type="text" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                <select 
                  name="class" 
                  value={formData.class}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {[5, 6, 7, 8, 9, 10, 11, 12].map(num => (
                    <option key={num} value={num}>Class {num}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stream</label>
                <select 
                  name="stream" 
                  value={formData.stream}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="PCM">PCM</option>
                  <option value="PCB">PCB</option>
                  <option value="Commerce">Commerce</option>
                  <option value="Arts">Arts</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-4 py-2 bg-blue-500 text-white rounded-md ${isSubmitting ? 'opacity-75 cursor-not-allowed' : 'hover:bg-blue-600'}`}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <i className="fas fa-spinner fa-spin mr-2"></i> Saving...
                  </span>
                ) : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;