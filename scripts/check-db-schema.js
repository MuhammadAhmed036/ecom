const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:1234@localhost:5432/ecommerce_db',
});

async function checkDBSchema() {
  try {
    console.log('Checking Database Schema...');
    
    // Check products table columns
    const columnsResult = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'products' 
      ORDER BY ordinal_position
    `);
    
    console.log('📋 Products table columns:');
    columnsResult.rows.forEach(row => {
      console.log(`  - ${row.column_name} (${row.data_type})`);
    });
    
    // Check sample product data
    const sampleResult = await pool.query('SELECT * FROM products LIMIT 1');
    if (sampleResult.rows.length > 0) {
      console.log('\n📦 Sample product data:');
      const product = sampleResult.rows[0];
      Object.keys(product).forEach(key => {
        console.log(`  - ${key}: ${product[key]}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error checking database schema:', error);
  } finally {
    await pool.end();
  }
}

checkDBSchema();
