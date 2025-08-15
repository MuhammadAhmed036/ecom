const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:1234@localhost:5432/ecommerce_db',
});

async function testAdminAPI() {
  try {
    console.log('Testing Admin Products API...');
    
    // Test 1: Check if we can connect to database
    const dbTest = await pool.query('SELECT COUNT(*) as count FROM products');
    console.log('✅ Database connection successful');
    console.log('📊 Total products in database:', dbTest.rows[0].count);
    
    // Test 2: Create a test JWT token for admin
    const jwtSecret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';
    const testToken = jwt.sign(
      {
        userId: 1,
        email: 'admin@ahmedbrands.com',
        role: 'admin',
      },
      jwtSecret,
      { expiresIn: '7d' }
    );
    console.log('✅ Test JWT token created');
    
    // Test 3: Test the API query that would be used
    const apiQuery = `
      SELECT id, name, description, price, category, subcategory, image_url, stock_quantity, created_at, updated_at
      FROM products 
      ORDER BY created_at DESC
    `;
    
    const apiResult = await pool.query(apiQuery);
    console.log('✅ API query successful');
    console.log('📦 Products returned:', apiResult.rows.length);
    
    if (apiResult.rows.length > 0) {
      console.log('📱 Sample product:', apiResult.rows[0].name);
    }
    
    // Test 4: Test adding a product
    const testProduct = {
      name: 'Test Product',
      description: 'This is a test product',
      price: 99.99,
      category: 'mens-clothing',
      subcategory: 't-shirts',
      image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
      stock_quantity: 10
    };
    
    const insertResult = await pool.query(`
      INSERT INTO products (name, description, price, category, subcategory, image_url, stock_quantity, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
      RETURNING id, name, description, price, category, subcategory, image_url, stock_quantity, created_at
    `, [testProduct.name, testProduct.description, testProduct.price, testProduct.category, testProduct.subcategory, testProduct.image_url, testProduct.stock_quantity]);
    
    console.log('✅ Product insertion successful');
    console.log('🆕 New product ID:', insertResult.rows[0].id);
    
    // Clean up - delete the test product
    await pool.query('DELETE FROM products WHERE id = $1', [insertResult.rows[0].id]);
    console.log('🧹 Test product cleaned up');
    
  } catch (error) {
    console.error('❌ Admin API test failed:', error);
  } finally {
    await pool.end();
  }
}

testAdminAPI();
