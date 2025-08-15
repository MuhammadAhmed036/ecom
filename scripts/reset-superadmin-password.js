const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function resetSuperadminPassword() {
  try {
    console.log('Connecting to database...');
    
    // Create a new password hash
    const newPassword = 'superadmin123';
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    // Update the superadmin password
    const result = await pool.query(
      'UPDATE users SET password = $1 WHERE email = $2 RETURNING id, name, email, role',
      [hashedPassword, 'superadmin@ahmedbrands.com']
    );
    
    if (result.rows.length > 0) {
      console.log('✅ Superadmin password reset successfully!');
      console.log('📧 Email: superadmin@ahmedbrands.com');
      console.log('🔑 New Password: superadmin123');
      console.log('👤 User:', result.rows[0].name);
      console.log('🎭 Role:', result.rows[0].role);
    } else {
      console.log('❌ Superadmin user not found. Creating new superadmin...');
      
      // Create a new superadmin user
      const newSuperadmin = await pool.query(`
        INSERT INTO users (name, email, password, phone, age, gender, role, is_approved, profile_image, address_line1, city, state, zip_code, country)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING id, name, email, role
      `, [
        'Super Admin',
        'superadmin@ahmedbrands.com',
        hashedPassword,
        '+1234567890',
        35,
        'male',
        'superadmin',
        true,
        '/api/placeholder/150/150',
        '123 Admin Street',
        'Admin City',
        'Admin State',
        '12345',
        'Admin Country'
      ]);
      
      console.log('✅ New superadmin created successfully!');
      console.log('📧 Email: superadmin@ahmedbrands.com');
      console.log('🔑 Password: superadmin123');
      console.log('👤 User:', newSuperadmin.rows[0].name);
      console.log('🎭 Role:', newSuperadmin.rows[0].role);
    }
    
  } catch (error) {
    console.error('❌ Error resetting superadmin password:', error);
  } finally {
    await pool.end();
  }
}

resetSuperadminPassword();
