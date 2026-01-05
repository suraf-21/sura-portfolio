const bcrypt = require('bcrypt');

async function generateCorrectHash() {
  const password = 'password123'; // The password you want to use
  
  try {
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    
    console.log('✅ Correct Hash Generated:');
    console.log('Password:', password);
    console.log('Hash:', hash);
    console.log('\n📋 Update your MongoDB document with this hash:');
    
    // MongoDB update command
    console.log('\n📝 MongoDB Update Command:');
    console.log(`db.users.updateOne(
      { email: "admin@example.com" },
      { $set: { password: "${hash}" } }
    )`);
  } catch (error) {
    console.error('Error:', error);
  }
}

generateCorrectHash();