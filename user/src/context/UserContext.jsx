// import { createContext, useState, useContext, useEffect } from 'react';

// // Mock user data template (without profile picture)
// const mockUserTemplate = {
//   firstName: "",
//   lastName: "",
//   email: "",
//   class: "",
//   stream: "",
//   phone: "",
//   profilePicture: "", // No default profile picture
//   stats: {
//     quizzesTaken: 0,
//     averageScore: 0,
//     dayStreak: 0,
//     timeSpent: 0
//   },
//   preferences: {
//     quizDuration: "30",
//     difficultyLevel: "Medium",
//     notifications: true
//   },
//   recentActivity: []
// };

// // Demo user for sign in
// const demoUser = {
//   firstName: "John",
//   lastName: "Doe",
//   email: "johndoe@example.com",
//   class: "12",
//   stream: "PCM",
//   phone: "+91 9876543210",
//   profilePicture: "", // No default profile picture
//   stats: {
//     quizzesTaken: 24,
//     averageScore: 85,
//     dayStreak: 7,
//     timeSpent: 12
//   },
//   preferences: {
//     quizDuration: "30",
//     difficultyLevel: "Medium",
//     notifications: true
//   },
//   recentActivity: [
//     {
//       id: 1,
//       subject: "Physics",
//       topic: "Mechanics",
//       score: 92,
//       timeAgo: "2 hours ago"
//     },
//     {
//       id: 2,
//       subject: "Chemistry",
//       topic: "Organic",
//       score: 88,
//       timeAgo: "1 day ago"
//     },
//     {
//       id: 3,
//       subject: "Math",
//       topic: "Calculus",
//       score: 95,
//       timeAgo: "2 days ago"
//     }
//   ]
// };

// const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   const [userData, setUserData] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   // Check if user is already logged in on component mount
//   useEffect(() => {
//     const storedUser = localStorage.getItem('user');
//     if (storedUser) {
//       try {
//         const parsedUser = JSON.parse(storedUser);
//         setUserData(parsedUser);
//         setIsAuthenticated(true);
//       } catch (err) {
//         console.error('Failed to parse stored user data', err);
//         localStorage.removeItem('user');
//       }
//     }
//   }, []);

//   // Sign in
//   const signIn = async (email, password) => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       // In a real app, this would call an authentication API
//       // For demo purposes, we'll just check if email contains "@" and password is not empty
//       if (email.includes('@') && password.length > 0) {
//         // Mock successful login
//         const userData = demoUser;
        
//         // Store user in localStorage for persistence
//         localStorage.setItem('user', JSON.stringify(userData));
        
//         setUserData(userData);
//         setIsAuthenticated(true);
//         return true;
//       } else {
//         throw new Error('Invalid credentials');
//       }
//     } catch (err) {
//       setError(err.message || 'Failed to sign in');
//       console.error('Error signing in:', err);
//       return false;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Sign up
//   const signUp = async (userData) => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       // Create a new user based on the template and provided data
//       const newUserData = {
//         ...mockUserTemplate,
//         firstName: userData.firstName,
//         lastName: userData.lastName,
//         email: userData.email,
//         class: userData.class || "",
//         stream: userData.stream || ""
//       };
      
//       // Store user in localStorage for persistence
//       localStorage.setItem('user', JSON.stringify(newUserData));
      
//       setUserData(newUserData);
//       setIsAuthenticated(true);
//       return true;
//     } catch (err) {
//       setError(err.message || 'Failed to sign up');
//       console.error('Error signing up:', err);
//       return false;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Sign out
//   const signOut = () => {
//     localStorage.removeItem('user');
//     setUserData(null);
//     setIsAuthenticated(false);
//   };

//   // Update user data
//   const updateUserData = async (newData) => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       // Update the local state
//       const updatedUserData = {
//         ...userData,
//         ...newData
//       };
      
//       // Update localStorage
//       localStorage.setItem('user', JSON.stringify(updatedUserData));
      
//       setUserData(updatedUserData);
//       return true;
//     } catch (err) {
//       setError(err.message || "Failed to update user profile");
//       console.error("Error updating user profile:", err);
//       return false;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Update profile picture
//   const updateProfilePicture = async (imageUrl) => {
//     if (!userData) return false;
    
//     try {
//       const updatedUserData = {
//         ...userData,
//         profilePicture: imageUrl
//       };
      
//       localStorage.setItem('user', JSON.stringify(updatedUserData));
//       setUserData(updatedUserData);
//       return true;
//     } catch (err) {
//       setError(err.message || "Failed to update profile picture");
//       console.error("Error updating profile picture:", err);
//       return false;
//     }
//   };

//   return (
//     <UserContext.Provider value={{ 
//       userData, 
//       isLoading, 
//       error, 
//       isAuthenticated,
//       signIn, 
//       signUp, 
//       signOut,
//       updateUserData,
//       updateProfilePicture
//     }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// export const useUser = () => useContext(UserContext);



import { createContext, useState, useContext, useEffect } from 'react';

const BASE_URL = 'http://localhost:3000/api/auth';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // On mount, try restoring user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (storedUser && token) {
      try {
        setUserData(JSON.parse(storedUser));
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Failed to parse user data:', err);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }, []);

  const signIn = async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Login failed');
      }

      const data = await res.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      setUserData(data.user);
      setIsAuthenticated(true);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (userDetails) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userDetails)
      });
      console.log(res)

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Sign up failed');
      }

      const data = await res.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      setUserData(data.user);
      setIsAuthenticated(true);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUserData(null);
    setIsAuthenticated(false);
  };

  const updateUserData = async (updates) => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`${BASE_URL}/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Update failed');
      }

      const data = await res.json();
      localStorage.setItem('user', JSON.stringify(data));
      setUserData(data);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfilePicture = async (imageUrl) => {
    return updateUserData({ profilePicture: imageUrl });
  };

  return (
    <UserContext.Provider value={{
      userData,
      isAuthenticated,
      isLoading,
      error,
      signIn,
      signUp,
      signOut,
      updateUserData,
      updateProfilePicture
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
