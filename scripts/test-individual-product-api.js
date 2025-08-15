const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:1234@localhost:5432/ecommerce_db',
});

async function testIndividualProductAPI() {
  try {
    console.log('Testing Individual Product API...');
    
    // Test 1: Get a product from database
    const productsResult = await pool.query('SELECT id, name FROM products LIMIT 1');
    
    if (productsResult.rows.length === 0) {
      console.log('❌ No products found in database');
      return;
    }
    
    const testProduct = productsResult.rows[0];
    console.log(`📦 Testing with product: ${testProduct.name} (ID: ${testProduct.id})`);
    
    // Test 2: Test the exact query that the API uses
    const apiQuery = `
      SELECT id, name, description, price, category, subcategory, image_url, stock_quantity, created_at, updated_at 
      FROM products 
      WHERE id = $1
    `;
    
    const apiResult = await pool.query(apiQuery, [testProduct.id]);
    
    if (apiResult.rows.length > 0) {
      console.log('✅ API query works correctly');
      console.log('📱 Product details:');
      console.log(`   - Name: ${apiResult.rows[0].name}`);
      console.log(`   - Price: $${apiResult.rows[0].price}`);
      console.log(`   - Category: ${apiResult.rows[0].category}`);
      console.log(`   - Image URL: ${apiResult.rows[0].image_url}`);
      console.log(`   - Stock: ${apiResult.rows[0].stock_quantity}`);
    } else {
      console.log('❌ API query returned no results');
    }
    
    // Test 3: Test with invalid ID
    const invalidResult = await pool.query(apiQuery, [999999]);
    console.log(`🔍 Invalid ID test: ${invalidResult.rows.length} results (should be 0)`);
    
    // Test 4: Test the exact API endpoint URL structure
    console.log(`🌐 API endpoint would be: /api/products/${testProduct.id}`);
    console.log(`📋 Expected response structure:`);
    console.log(`   {
     "product": {
       "id": ${testProduct.id},
       "name": "${testProduct.name}",
       "description": "...",
       "price": ...,
       "category": "...",
       "subcategory": "...",
       "image_url": "...",
       "stock_quantity": ...,
       "is_featured": ...,
       "created_at": "..."
     }
   }`);
    
  } catch (error) {
    console.error('❌ Error testing individual product API:', error);
  } finally {
    await pool.end();
  }
}

testIndividualProductAPI();
