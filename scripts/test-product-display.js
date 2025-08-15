const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:1234@localhost:5432/ecommerce_db',
});

async function testProductDisplay() {
  try {
    console.log('Testing Product Display...');
    
    // Test 1: Check if products exist in database
    const productsResult = await pool.query('SELECT id, name, price, image_url, category FROM products LIMIT 5');
    console.log('✅ Products in database:', productsResult.rows.length);
    
    if (productsResult.rows.length > 0) {
      console.log('📦 Sample products:');
      productsResult.rows.forEach(product => {
        console.log(`  - ${product.name} ($${product.price}) - ${product.category}`);
        console.log(`    Image URL: ${product.image_url}`);
        console.log(`    Product ID: ${product.id}`);
        console.log('');
      });
    } else {
      console.log('❌ No products found in database');
    }
    
    // Test 2: Check if image URLs are valid
    console.log('🔍 Checking image URLs...');
    for (const product of productsResult.rows) {
      if (product.image_url) {
        console.log(`✅ ${product.name}: Image URL exists`);
      } else {
        console.log(`❌ ${product.name}: No image URL`);
      }
    }
    
    // Test 3: Test individual product API query
    if (productsResult.rows.length > 0) {
      const firstProduct = productsResult.rows[0];
      const individualQuery = await pool.query(
        'SELECT id, name, description, price, category, subcategory, image_url, stock_quantity, created_at FROM products WHERE id = $1',
        [firstProduct.id]
      );
      
      if (individualQuery.rows.length > 0) {
        console.log('✅ Individual product query works');
        console.log(`📱 Product details for ${firstProduct.name}:`);
        console.log(`   - Description: ${individualQuery.rows[0].description?.substring(0, 50)}...`);
        console.log(`   - Stock: ${individualQuery.rows[0].stock_quantity}`);
        console.log(`   - Category: ${individualQuery.rows[0].category}`);
      } else {
        console.log('❌ Individual product query failed');
      }
    }
    
  } catch (error) {
    console.error('❌ Error testing product display:', error);
  } finally {
    await pool.end();
  }
}

testProductDisplay();
