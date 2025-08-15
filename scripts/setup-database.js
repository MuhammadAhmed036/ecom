const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function setupDatabase() {
  try {
    console.log('Connecting to database...');
    
    // Drop existing tables in correct order (due to foreign key constraints)
    console.log('Dropping existing tables...');
    await pool.query('DROP TABLE IF EXISTS wishlist CASCADE');
    await pool.query('DROP TABLE IF EXISTS order_items CASCADE');
    await pool.query('DROP TABLE IF EXISTS orders CASCADE');
    await pool.query('DROP TABLE IF EXISTS products CASCADE');
    await pool.query('DROP TABLE IF EXISTS users CASCADE');
    
    console.log('Creating tables...');

    // Create users table with all new fields
    await pool.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        age INTEGER,
        gender VARCHAR(10),
        role VARCHAR(20) DEFAULT 'customer',
        is_approved BOOLEAN DEFAULT false,
        profile_image VARCHAR(500),
        address_line1 VARCHAR(255),
        address_line2 VARCHAR(255),
        city VARCHAR(100),
        state VARCHAR(100),
        zip_code VARCHAR(20),
        country VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create products table
    await pool.query(`
      CREATE TABLE products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        category VARCHAR(100),
        subcategory VARCHAR(100),
        image_url VARCHAR(500),
        stock_quantity INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create orders table
    await pool.query(`
      CREATE TABLE orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        order_number VARCHAR(50) UNIQUE NOT NULL,
        total_amount DECIMAL(10,2) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        shipping_address TEXT,
        payment_method VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create order_items table
    await pool.query(`
      CREATE TABLE order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
        product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
        quantity INTEGER NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create wishlist table
    await pool.query(`
      CREATE TABLE wishlist (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, product_id)
      )
    `);

    // Insert sample data
    console.log('Inserting sample data...');

    // Insert sample users
    const sampleUsers = [
      {
        name: 'Super Admin',
        email: 'superadmin@ahmedbrands.com',
        password: '$2a$10$rQZ8K9mN2pL1vX3yU7wE4t.5sA6bC8dF0gH1iJ2kL3mN4oP5qR6sT7uV8wX9yZ',
        phone: '+1234567890',
        age: 35,
        gender: 'male',
        role: 'superadmin',
        is_approved: true,
        profile_image: '/api/placeholder/150/150',
        address_line1: '123 Admin Street',
        city: 'Admin City',
        state: 'Admin State',
        zip_code: '12345',
        country: 'Admin Country'
      },
      {
        name: 'John Admin',
        email: 'admin@ahmedbrands.com',
        password: '$2a$10$rQZ8K9mN2pL1vX3yU7wE4t.5sA6bC8dF0gH1iJ2kL3mN4oP5qR6sT7uV8wX9yZ',
        phone: '+1234567891',
        age: 30,
        gender: 'male',
        role: 'admin',
        is_approved: true,
        profile_image: '/api/placeholder/150/150',
        address_line1: '456 Admin Ave',
        city: 'Admin City',
        state: 'Admin State',
        zip_code: '12346',
        country: 'Admin Country'
      },
      {
        name: 'Sarah Customer',
        email: 'customer@ahmedbrands.com',
        password: '$2a$10$rQZ8K9mN2pL1vX3yU7wE4t.5sA6bC8dF0gH1iJ2kL3mN4oP5qR6sT7uV8wX9yZ',
        phone: '+1234567892',
        age: 25,
        gender: 'female',
        role: 'customer',
        is_approved: true,
        profile_image: '/api/placeholder/150/150',
        address_line1: '789 Customer Blvd',
        city: 'Customer City',
        state: 'Customer State',
        zip_code: '12347',
        country: 'Customer Country'
      }
    ];

    for (const user of sampleUsers) {
      await pool.query(`
        INSERT INTO users (name, email, password, phone, age, gender, role, is_approved, profile_image, address_line1, city, state, zip_code, country)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      `, [user.name, user.email, user.password, user.phone, user.age, user.gender, user.role, user.is_approved, user.profile_image, user.address_line1, user.city, user.state, user.zip_code, user.country]);
    }

    // Insert sample products
    const sampleProducts = [
      {
        name: 'Premium Cotton T-Shirt',
        description: 'High-quality cotton t-shirt with modern fit',
        price: 29.99,
        category: 'mens-clothing',
        subcategory: 't-shirts',
        image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
        stock_quantity: 100
      },
      {
        name: 'Elegant Summer Dress',
        description: 'Beautiful summer dress perfect for any occasion',
        price: 89.99,
        category: 'womens-clothing',
        subcategory: 'dresses',
        image_url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400',
        stock_quantity: 50
      },
      {
        name: 'Leather Wallet',
        description: 'Genuine leather wallet with multiple card slots',
        price: 49.99,
        category: 'mens-accessories',
        subcategory: 'wallets',
        image_url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400',
        stock_quantity: 75
      },
      {
        name: 'Designer Handbag',
        description: 'Stylish designer handbag with gold accents',
        price: 199.99,
        category: 'womens-accessories',
        subcategory: 'handbags',
        image_url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400',
        stock_quantity: 25
      },
      {
        name: 'Classic Denim Jeans',
        description: 'Comfortable denim jeans with perfect fit',
        price: 79.99,
        category: 'mens-clothing',
        subcategory: 'jeans',
        image_url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
        stock_quantity: 80
      },
      {
        name: 'Silk Blouse',
        description: 'Elegant silk blouse for professional wear',
        price: 129.99,
        category: 'womens-clothing',
        subcategory: 'blouses',
        image_url: 'https://images.unsplash.com/photo-1564257631407-3deb25e91d81?w=400',
        stock_quantity: 40
      },
      {
        name: 'Stainless Steel Watch',
        description: 'Premium stainless steel watch with leather strap',
        price: 299.99,
        category: 'mens-accessories',
        subcategory: 'watches',
        image_url: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400',
        stock_quantity: 30
      },
      {
        name: 'Pearl Necklace',
        description: 'Elegant pearl necklace for special occasions',
        price: 159.99,
        category: 'womens-accessories',
        subcategory: 'jewelry',
        image_url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400',
        stock_quantity: 20
      }
    ];

    for (const product of sampleProducts) {
      await pool.query(`
        INSERT INTO products (name, description, price, category, subcategory, image_url, stock_quantity)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [product.name, product.description, product.price, product.category, product.subcategory, product.image_url, product.stock_quantity]);
    }

    // Insert sample orders
    const sampleOrders = [
      {
        user_id: 3, // Sarah Customer
        order_number: 'ORD-2024-001',
        total_amount: 119.98,
        status: 'completed',
        shipping_address: '789 Customer Blvd, Customer City, Customer State 12347, Customer Country',
        payment_method: 'credit_card'
      },
      {
        user_id: 3, // Sarah Customer
        order_number: 'ORD-2024-002',
        total_amount: 199.99,
        status: 'pending',
        shipping_address: '789 Customer Blvd, Customer City, Customer State 12347, Customer Country',
        payment_method: 'paypal'
      }
    ];

    for (const order of sampleOrders) {
      await pool.query(`
        INSERT INTO orders (user_id, order_number, total_amount, status, shipping_address, payment_method)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [order.user_id, order.order_number, order.total_amount, order.status, order.shipping_address, order.payment_method]);
    }

    // Insert sample order items
    const sampleOrderItems = [
      { order_id: 1, product_id: 1, quantity: 2, price: 29.99 }, // 2 t-shirts
      { order_id: 1, product_id: 3, quantity: 1, price: 49.99 }, // 1 wallet
      { order_id: 1, product_id: 4, quantity: 1, price: 199.99 }, // 1 handbag
      { order_id: 2, product_id: 4, quantity: 1, price: 199.99 }  // 1 handbag
    ];

    for (const item of sampleOrderItems) {
      await pool.query(`
        INSERT INTO order_items (order_id, product_id, quantity, price)
        VALUES ($1, $2, $3, $4)
      `, [item.order_id, item.product_id, item.quantity, item.price]);
    }

    console.log('Database setup completed successfully!');
    console.log('Sample data inserted:');
    console.log('- 3 users (Super Admin, Admin, Customer)');
    console.log('- 8 products across different categories');
    console.log('- 2 sample orders with order items');

  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    await pool.end();
  }
}

setupDatabase();
