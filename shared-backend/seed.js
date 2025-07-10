
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';

dotenv.config();

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // Clear existing users (optional)
    await User.deleteMany();

    const users = [
      {
        name: 'Admin User',
        email: 'admin@test.com',
        password: await bcrypt.hash('admin123', 10),
        role: 'admin',
      },
      {
        name: 'Test Student',
        email: 'student@test.com',
        password: await bcrypt.hash('student123', 10),
        role: 'student',
        class: 10,
        stream: 'PCM',
      },
    ];

    await User.insertMany(users);
    console.log('✅ Users seeded successfully!');
    process.exit();
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
};

seedUsers();
