import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Submission from '../models/Submission.js';

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, class: userClass, stream } = req.body; // ✅ include role
    console.log("Received:", req.body);

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);

    const newUser = await User.create({ 
      name, 
      email, 
      password: hashed, 
      role, // ✅ include role
      class: userClass, 
      stream,
      profilePicture: '',
      bio: '',
      preferences: {
        favoriteSubjects: [],
        studyReminders: false,
        darkMode: false
      },
      stats: {
        quizzesTaken: 0,
        totalScore: 0,
        averageScore: 0,
        topicsCompleted: 0
      }
    });

    const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '2d' });

    const userToReturn = newUser.toObject();
    delete userToReturn.password;

    res.status(201).json({ 
      message: 'Registered successfully', 
      token, 
      user: userToReturn 
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: err.message });
  }
};


export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Update last active timestamp
    user.lastActive = new Date();
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '2d' });
    
    // Don't return password in response
    const userToReturn = user.toObject();
    delete userToReturn.password;
    
    res.json({ token, user: userToReturn });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: err.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    // Find user without password
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Get stats from submissions
    const submissions = await Submission.find({ student: user._id });
    
    // Calculate statistics
    const quizzesTaken = submissions.length;
    const totalScore = submissions.reduce((sum, sub) => sum + sub.score, 0);
    const averageScore = quizzesTaken > 0 ? Math.round(totalScore / quizzesTaken) : 0;
    
    // Get unique topics completed
    const uniqueTopics = new Set();
    submissions.forEach(sub => {
      if (sub.topic) uniqueTopics.add(`${sub.subject}-${sub.topic}`);
      else uniqueTopics.add(sub.subject);
    });
    
    // Update user stats
    user.stats = {
      quizzesTaken,
      totalScore,
      averageScore,
      topicsCompleted: uniqueTopics.size
    };
    
    await user.save();
    
    res.json(user);
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ message: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, bio, profilePicture, preferences, class: userClass, stream } = req.body;
    
    // Find user
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Update fields if provided
    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (profilePicture) user.profilePicture = profilePicture;
    if (userClass) user.class = userClass;
    if (stream) user.stream = stream;
    
    // Update preferences if provided
    if (preferences) {
      user.preferences = {
        ...user.preferences,
        ...preferences
      };
    }
    
    await user.save();
    
    res.json(user);
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ message: err.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Find user
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });
    
    // Hash new password
    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    
    await user.save();
    
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ message: err.message });
  }
};


