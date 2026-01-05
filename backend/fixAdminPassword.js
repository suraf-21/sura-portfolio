const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

async function fixAdminPassword() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');

    // Generate correct hash for password123
    const correctHash = await bcrypt.hash('password123', 10);
    console.log('✅ Generated correct hash for password123');
    
    // Update the user with correct hash
    const result = await mongoose.connection.db.collection('users').updateOne(
      { email: 'admin@example.com' },
      { $set: { password: correctHash, updatedAt: new Date() } }
    );

    if (result.modifiedCount === 1) {
      console.log('✅ Admin password fixed successfully!');
      console.log('========================================');
      console.log('📧 Email: admin@example.com');
      console.log('🔑 Password: password123');
      console.log('========================================');
    } else {
      console.log('⚠️  Admin user not found or already has correct password');
    }
    
    // Verify
    const user = await mongoose.connection.db.collection('users').findOne({ 
      email: 'admin@example.com' 
    });
    console.log('🔍 Verifying...');
    console.log('Stored hash length:', user.password.length);
    
    // Test the hash
    const isMatch = await bcrypt.compare('password123', user.password);
    console.log('Password verification test:', isMatch ? '✅ PASS' : '❌ FAIL');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing admin password:', error);
    process.exit(1);
  }
}

fixAdminPassword();