const jwt = require('jsonwebtoken');
require('dotenv').config();

async function testJWTToken() {
  try {
    console.log('Testing JWT Token Verification...');
    console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Not Set');
    
    // Test with a sample token structure
    const testPayload = {
      userId: 1,
      email: 'admin@ahmedbrands.com',
      role: 'admin'
    };
    
    // Create a test token
    const testToken = jwt.sign(testPayload, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: '7d' });
    console.log('✅ Test token created successfully');
    
    // Verify the token
    const decoded = jwt.verify(testToken, process.env.JWT_SECRET || 'fallback-secret');
    console.log('✅ Token verification successful');
    console.log('Decoded payload:', decoded);
    
    // Test role checking
    if (decoded.role === 'admin' || decoded.role === 'superadmin') {
      console.log('✅ Role verification successful');
    } else {
      console.log('❌ Role verification failed');
    }
    
  } catch (error) {
    console.error('❌ JWT Token test failed:', error.message);
  }
}

testJWTToken();
