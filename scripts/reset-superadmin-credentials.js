const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

// Load environment variables manually
const fs = require('fs');
const path = require('path');

// Read .env.local file
const envPath = path.join(__dirname, '..', '.env.local');
let envContent = '';
try {
  envContent = fs.readFileSync(envPath, 'utf8');
} catch (error) {
  console.log('❌ .env.local not found, using default values');
}

// Parse environment variables
const envVars = {};
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    envVars[key.trim()] = value.trim();
  }
});

const pool = new Pool({
  connectionString: envVars.DATABASE_URL || 'postgresql://postgres:1234@localhost:5432/ecommerce_db'
});

async function resetSuperadminCredentials() {
  try {
    console.log('🔐 Resetting Superadmin Credentials...');
    
    // Check if superadmin exists
    const checkResult = await pool.query('SELECT * FROM users WHERE role = $1', ['head']);
    
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
      console.log('📧 Email:', insertResult.rows[0].email);
      console.log('🔑 Password: superadmin123');
      console.log('👤 Name:', insertResult.rows[0].name);
      console.log('🔐 Role:', insertResult.rows[0].role);
      
    } else {
      console.log('✅ Superadmin already exists. Updating password...');
      
      // Update existing superadmin password
      const hashedPassword = await bcrypt.hash('superadmin123', 10);
      await pool.query('UPDATE users SET password = $1 WHERE role = $2', [hashedPassword, 'head']);
      
      const superadmin = checkResult.rows[0];
      console.log('✅ Superadmin password updated successfully!');
      console.log('📧 Email:', superadmin.email);
      console.log('🔑 Password: superadmin123');
      console.log('👤 Name:', superadmin.name);
      console.log('🔐 Role:', superadmin.role);
    }
    
    // Show all users
    console.log('\n👥 All Users in Database:');
    const allUsers = await pool.query('SELECT id, email, name, role, is_approved FROM users ORDER BY created_at');
    
    allUsers.rows.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email}) - ${user.role} ${user.is_approved ? '✅ Approved' : '⏳ Pending'}`);
    });
    
  } catch (error) {
    console.error('❌ Error resetting superadmin credentials:', error);
  } finally {
    await pool.end();
  }
}

resetSuperadminCredentials();
