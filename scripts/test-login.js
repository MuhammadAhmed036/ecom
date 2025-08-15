const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  connectionString: 'postgresql://postgres:1234@localhost:5432/ecommerce_db'
});

async function testLogin() {
  try {
    console.log('🧪 Testing Login Process Step by Step...');
    
    const testEmail = 'superadmin@ahmedbrands.com';
    const testPassword = 'superadmin123';
    
    // Step 1: Check if user exists
    console.log('\n1️⃣ Checking if user exists...');
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [testEmail]);
    
    if (userResult.rows.length === 0) {
      console.log('❌ User not found!');
      return;
    }
    
    const user = userResult.rows[0];
    console.log('✅ User found:');
    console.log(`   - ID: ${user.id}`);
    console.log(`   - Name: ${user.name}`);
    console.log(`   - Email: ${user.email}`);
    console.log(`   - Role: ${user.role}`);
    console.log(`   - Approved: ${user.is_approved}`);
    console.log(`   - Password hash: ${user.password ? 'Exists' : 'Missing'}`);
    
    // Step 2: Check if user is approved
    console.log('\n2️⃣ Checking approval status...');
    if ((user.role === 'admin' || user.role === 'superadmin' || user.role === 'head') && !user.is_approved) {
      console.log('❌ User not approved!');
      return;
    }
    console.log('✅ User is approved');
    
    // Step 3: Test password verification
    console.log('\n3️⃣ Testing password verification...');
    const isPasswordValid = await bcrypt.compare(testPassword, user.password);
    console.log(`Password verification result: ${isPasswordValid ? '✅ Valid' : '❌ Invalid'}`);
    
    if (!isPasswordValid) {
      console.log('❌ Password verification failed!');
      console.log('Let me check what the password hash looks like...');
      console.log(`Password hash: ${user.password}`);
      
      // Try to hash the password again and compare
      const newHash = await bcrypt.hash(testPassword, 10);
      console.log(`New hash for '${testPassword}': ${newHash}`);
      
      // Test if the new hash works
      const testNewHash = await bcrypt.compare(testPassword, newHash);
      console.log(`Test with new hash: ${testNewHash ? '✅ Works' : '❌ Still fails'}`);
    }
    
    // Step 4: Show all users with similar roles
    console.log('\n4️⃣ Checking all users with admin/superadmin roles...');
    const adminUsers = await pool.query('SELECT id, email, name, role, is_approved FROM users WHERE role IN ($1, $2, $3)', ['admin', 'superadmin', 'head']);
    
    adminUsers.rows.forEach((adminUser, index) => {
      console.log(`${index + 1}. ${adminUser.name} (${adminUser.email}) - ${adminUser.role} ${adminUser.is_approved ? '✅ Approved' : '⏳ Pending'}`);
    });
    
  } catch (error) {
    console.error('❌ Error testing login:', error);
  } finally {
    await pool.end();
  }
}

testLogin();
