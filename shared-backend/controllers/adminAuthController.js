import Admin from '../models/Admin.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET_ADMIN, { expiresIn: '30d' });

export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const admin = new Admin(req.body);
    await admin.save();

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET_ADMIN, { expiresIn: '7d' });
    res.status(201).json({ token });
  } catch (error) {
    console.error('[Register Admin Error]', error);  
    res.status(500).json({ message: 'Server error' });
  }
};


export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    console.log(admin)
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = generateToken(admin._id);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Login error', error: err.message });
  }
};

export const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).select('-password');
    res.json(admin);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get profile' });
  }
};

export const updateAdminProfile = async (req, res) => {
  try {
    const updates = req.body;
    const admin = await Admin.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');
    res.json(admin);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update profile' });
  }
};
