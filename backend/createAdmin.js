const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');
require('dotenv').config();

async function createAdmin() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@example.com' });
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists');
      console.log('Email: admin@example.com');
      console.log('You can use the existing account or delete it first');
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    // Create admin user
    const admin = new User({
      username: 'admin',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin'
    });

    await admin.save();
    
    console.log('✅ Admin user created successfully!');
    console.log('========================================');
    console.log('📧 Email: admin@example.com');
    console.log('🔑 Password: password123');
    console.log('========================================');
    console.log('⚠️  IMPORTANT: Change the password after first login!');
    console.log('🚀 You can now login at: http://localhost:3001/admin/login');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
}

createAdmin();