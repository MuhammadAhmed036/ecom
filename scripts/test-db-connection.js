const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Load environment variables manually
function loadEnvFile() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const envVars = {};
    
    envContent.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        envVars[key.trim()] = valueParts.join('=').trim();
      }
    });
    
    return envVars;
  }
  return {};
}

const envVars = loadEnvFile();
process.env.DATABASE_URL = process.env.DATABASE_URL || envVars.DATABASE_URL;

async function testDatabaseConnection() {
  console.log('🔍 Testing database connection...');
  console.log('📡 Connection URL:', process.env.DATABASE_URL || 'Not set');
  console.log('📡 Environment variables loaded:', Object.keys(envVars));
  
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL not found in environment variables');
    return;
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });

  try {
    const client = await pool.connect();
    console.log('✅ Database connection successful!');
    
    // Test a simple query
    const result = await client.query('SELECT NOW() as current_time, version() as db_version');
    console.log('⏰ Current database time:', result.rows[0].current_time);
    console.log('📊 Database version:', result.rows[0].db_version.split(' ')[0]);
    
    // Check if tables exist
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log('📋 Existing tables:', tablesResult.rows.map(row => row.table_name));
    
    client.release();
    await pool.end();
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Make sure PostgreSQL is running');
    console.log('2. Check your DATABASE_URL in .env.local');
    console.log('3. Verify username, password, and database name');
    console.log('4. Ensure the database exists');
  }
}

testDatabaseConnection();
