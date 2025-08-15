const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  connectionString: 'postgresql://postgres:1234@localhost:5432/ecommerce_db'
});

async function fixSuperadmin() {
  try {
    console.log('🔐 Fixing Superadmin Credentials...');
    
    // Check if superadmin exists by email
    const checkResult = await pool.query('SELECT * FROM users WHERE email = $1', ['superadmin@ahmedbrands.com']);
    
    if (checkResult.rows.length === 0) {
      console.log('❌ No superadmin found. Creating one...');
      
      // Create superadmin
      const hashedPassword = await bcrypt.hash('superadmin123', 10);
      const insertResult = await pool.query(`
        INSERT INTO users (email, password, name, phone, age, gender, role, is_approved, profile_image, address_line1, address_line2, city, state, zip_code, country, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
        RETURNING id, email, name, role
      `, [
        'superadmin@ahmedbrands.com',
        hashedPassword,
        'Super Admin',
        '+1234567890',
        30,
        'male',
        'head',
        true,
        null,
        '123 Admin Street',
        'Suite 100',
        'Admin City',
        'Admin State',
        '12345',
        'Admin Country',
        new Date(),
        new Date()
      ]);
      
      console.log('✅ Superadmin created successfully!');
      console.log('📧 Email: superadmin@ahmedbrands.com');
      console.log('🔑 Password: superadmin123');
      console.log('👤 Name: Super Admin');
      console.log('🔐 Role: head');
      
    } else {
      console.log('✅ Superadmin already exists. Updating password and role...');
      
      // Update existing superadmin password and role
      const hashedPassword = await bcrypt.hash('superadmin123', 10);
      await pool.query('UPDATE users SET password = $1, role = $2, is_approved = $3 WHERE email = $4', [
        hashedPassword, 'head', true, 'superadmin@ahmedbrands.com'
      ]);
      
      const superadmin = checkResult.rows[0];
      console.log('✅ Superadmin updated successfully!');
      console.log('📧 Email: superadmin@ahmedbrands.com');
      console.log('🔑 Password: superadmin123');
      console.log('👤 Name:', superadmin.name);
      console.log('🔐 Role: head (updated)');
    }
    
    // Show all users
    console.log('\n👥 All Users in Database:');
    const allUsers = await pool.query('SELECT id, email, name, role, is_approved FROM users ORDER BY created_at');
    
    allUsers.rows.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email}) - ${user.role} ${user.is_approved ? '✅ Approved' : '⏳ Pending'}`);
    });
    
  } catch (error) {
    console.error('❌ Error fixing superadmin credentials:', error);
  } finally {
    await pool.end();
  }
}

fixSuperadmin();
