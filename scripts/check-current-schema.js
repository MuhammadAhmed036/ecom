const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:1234@localhost:5432/ecommerce_db'
});

async function checkCurrentSchema() {
  try {
    console.log('🔍 Checking Current Database Schema...');
    
    // Check users table columns
    const usersColumns = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position
    `);
    
    console.log('\n📋 Users table columns:');
    usersColumns.rows.forEach(row => {
      console.log(`  - ${row.column_name} (${row.data_type})`);
    });
    
    // Check if superadmin exists
    const superadminCheck = await pool.query('SELECT * FROM users WHERE role = $1 LIMIT 1', ['head']);
    
    if (superadminCheck.rows.length > 0) {
      console.log('\n👑 Superadmin found:');
      const admin = superadminCheck.rows[0];
      Object.keys(admin).forEach(key => {
        console.log(`  - ${key}: ${admin[key]}`);
      });
    } else {
      console.log('\n❌ No superadmin found');
    }
    
    // Check products table
    const productsColumns = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'products' 
      ORDER BY ordinal_position
    `);
    
    console.log('\n📦 Products table columns:');
    productsColumns.rows.forEach(row => {
      console.log(`  - ${row.column_name} (${row.data_type})`);
    });
    
  } catch (error) {
    console.error('❌ Error checking schema:', error);
  } finally {
    await pool.end();
  }
}

checkCurrentSchema();
