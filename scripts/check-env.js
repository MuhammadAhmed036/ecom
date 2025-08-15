const jwt = require('jsonwebtoken');

console.log('🔍 Checking Environment Variables...');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not Set');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Not Set');
console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? 'Set' : 'Not Set');

// Test JWT signing
try {
  const testPayload = { userId: 1, email: 'test@test.com', role: 'superadmin' };
  const testSecret = process.env.JWT_SECRET || 'fallback-secret';
  
  console.log('\n🧪 Testing JWT Signing...');
  console.log('Using secret:', testSecret);
  
  const token = jwt.sign(testPayload, testSecret, { expiresIn: '7d' });
  console.log('✅ JWT signing works!');
  console.log('Token length:', token.length);
  
  // Test verification
  const decoded = jwt.verify(token, testSecret);
  console.log('✅ JWT verification works!');
  console.log('Decoded payload:', decoded);
  
} catch (error) {
  console.error('❌ JWT error:', error);
}
