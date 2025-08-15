const fetch = require('node-fetch');

async function testLoginAPI() {
  try {
    console.log('🧪 Testing Login API Directly...');
    
    const loginData = {
      email: 'superadmin@ahmedbrands.com',
      password: 'superadmin123'
    };
    
    console.log('📤 Sending login request...');
    console.log('Data:', loginData);
    
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData)
    });
    
    console.log(`📥 Response Status: ${response.status} ${response.statusText}`);
    
    const responseData = await response.json();
    console.log('📋 Response Data:', JSON.stringify(responseData, null, 2));
    
    if (response.ok) {
      console.log('✅ Login successful!');
      console.log('Token:', responseData.token ? 'Present' : 'Missing');
      console.log('User role:', responseData.user?.role);
    } else {
      console.log('❌ Login failed!');
      console.log('Error message:', responseData.message);
    }
    
  } catch (error) {
    console.error('❌ Error testing API:', error);
  }
}

testLoginAPI();
