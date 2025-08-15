const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function testProductsAPI() {
  try {
    console.log('Testing Products API...');
    
    // Test 1: Check if products table exists and has data
    const productsResult = await pool.query('SELECT COUNT(*) as count FROM products');
    console.log('📊 Total products in database:', productsResult.rows[0].count);
    
    // Test 2: Get some sample products
    const sampleProducts = await pool.query('SELECT id, name, price, category FROM products LIMIT 5');
    console.log('📦 Sample products:');
    sampleProducts.rows.forEach(product => {
      console.log(`  - ${product.name} ($${product.price}) - ${product.category}`);
    });
    
    // Test 3: Check if the API endpoint would work
    const apiQuery = `
      SELECT id, name, description, price, category, subcategory, image_url, stock_quantity, created_at 
      FROM products 
      ORDER BY created_at DESC 
      LIMIT 8
    `;
    
    const apiResult = await pool.query(apiQuery);
    console.log('🔗 API would return', apiResult.rows.length, 'products');
    
    if (apiResult.rows.length > 0) {
      console.log('✅ Products API should work correctly');
      console.log('📱 First product:', apiResult.rows[0].name);
    } else {
      console.log('❌ No products found - this is why customers can\'t see products');
    }
    
  } catch (error) {
    console.error('❌ Error testing products API:', error);
  } finally {
    await pool.end();
  }
}

testProductsAPI();
