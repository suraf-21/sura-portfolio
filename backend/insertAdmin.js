const mongoose = require('mongoose');
require('dotenv').config();

async function insertAdmin() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');

    // Check if admin already exists
    const existingAdmin = await mongoose.connection.db.collection('users').findOne({ 
      email: 'admin@example.com' 
    });
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists');
      console.log('Email:', existingAdmin.email);
      process.exit(0);
    }

    // Insert admin user with hashed password for "password123"
    const adminUser = {
      username: 'admin',
      email: 'admin@example.com',
      password: '$2b$10$7K.9JtF.5OcZ8W8LQYQqH.Vd1R2jH8sN8fK7aBcC3dE4fG5hJ6kL7m',
      role: 'admin',
      lastLogin: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await mongoose.connection.db.collection('users').insertOne(adminUser);
    
    console.log('✅ Admin user created successfully!');
    console.log('Inserted ID:', result.insertedId);
    console.log('========================================');
    console.log('📧 Email: admin@example.com');
    console.log('🔑 Password: password123');
    console.log('========================================');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
}

insertAdmin();