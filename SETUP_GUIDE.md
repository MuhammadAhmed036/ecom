# E-Commerce Website Setup Guide

## 🔧 Environment Setup

### 1. Create .env.local file
Create a file named `.env.local` in your project root with the following content:

```env
# Database Configuration
DATABASE_URL=postgresql://postgres:1234@localhost:5432/ecommerce_db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# NextAuth Configuration
NEXTAUTH_SECRET=your-nextauth-secret-key-change-this-in-production
NEXTAUTH_URL=http://localhost:3000
```

### 2. Generate Secure Secrets
To generate secure JWT and NextAuth secrets, run these commands in your terminal:

```bash
# Generate JWT Secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Generate NextAuth Secret
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Replace the placeholder values in `.env.local` with the generated secrets.

## 🗄️ Database Connection

### 1. Test Database Connection
Run the database connection test script:

```bash
node scripts/test-db-connection.js
```

This will:
- ✅ Check if DATABASE_URL is set
- ✅ Test connection to PostgreSQL
- ✅ Show database version and current time
- ✅ List existing tables
- ❌ Show troubleshooting tips if connection fails

### 2. pgAdmin Query Script
Run this query in pgAdmin's Query Tool to verify your database:

```sql
-- Check database connection and tables
SELECT 
    current_database() as database_name,
    current_user as current_user,
    version() as postgres_version,
    now() as current_timestamp;

-- Check if our tables exist
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'products');

-- Check users table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
AND table_schema = 'public';

-- Check if superadmin exists
SELECT id, name, email, role, is_approved 
FROM users 
WHERE role = 'superadmin';
```

### 3. Setup Database
If tables don't exist, run the setup script:

```bash
node scripts/setup-database.js
```

## 🔐 JWT (JSON Web Tokens) Explained

### What is JWT?
JWT (JSON Web Token) is a secure way to transmit information between parties as a JSON object. It's commonly used for authentication and authorization.

### How JWT Works in This App:
1. **Login**: User provides email/password
2. **Verification**: Server checks credentials against database
3. **Token Generation**: Server creates JWT with user ID and role
4. **Token Storage**: Client stores JWT in localStorage
5. **API Requests**: Client sends JWT in Authorization header
6. **Token Verification**: Server validates JWT before processing requests

### JWT Structure:
```
Header.Payload.Signature
```

- **Header**: Algorithm and token type
- **Payload**: User data (userId, role, expiration)
- **Signature**: Ensures token hasn't been tampered with

### How to Get/Use JWT Token:

1. **Login to get token**:
```javascript
// POST /api/auth/login
{
  "email": "superadmin@example.com",
  "password": "superadmin123"
}

// Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "id": 1, "name": "Super Admin", "role": "superadmin" }
}
```

2. **Use token in API requests**:
```javascript
fetch('/api/admin/users', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
```

## 🔑 NextAuth Secret

### What is NextAuth Secret?
NextAuth secret is used to encrypt JWT tokens and sign cookies. It should be a strong, random string.

### How to Get NextAuth Secret:
1. **Generate using Node.js**:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

2. **Or use a strong random string**:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

3. **Add to .env.local**:
```env
NEXTAUTH_SECRET=your-generated-secret-here
```

## 🚨 Troubleshooting SuperAdmin Page

### Common Issues and Solutions:

1. **Page Not Loading**:
   - Check browser console for errors
   - Verify database connection
   - Ensure JWT token is valid

2. **Authentication Errors**:
   - Clear localStorage and login again
   - Check if token is expired
   - Verify user role is 'superadmin'

3. **API Errors**:
   - Check if API routes are working
   - Verify database tables exist
   - Check server logs

### Debug Steps:

1. **Check Browser Console**:
```javascript
// In browser console
console.log('Token:', localStorage.getItem('token'));
console.log('User Role:', localStorage.getItem('userRole'));
```

2. **Test API Endpoints**:
```bash
# Test users API
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3000/api/admin/users

# Test products API
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3000/api/admin/products
```

3. **Check Database**:
```sql
-- Verify superadmin exists
SELECT * FROM users WHERE role = 'superadmin';

-- Check if tables have data
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM products;
```

## 🚀 Quick Start Commands

```bash
# 1. Install dependencies
npm install

# 2. Create .env.local with your values
# (Copy content from above)

# 3. Test database connection
node scripts/test-db-connection.js

# 4. Setup database (if needed)
node scripts/setup-database.js

# 5. Start development server
npm run dev

# 6. Open browser
# http://localhost:3000
```

## 🔍 Default Login Credentials

- **Superadmin**:
  - Email: `superadmin@example.com`
  - Password: `superadmin123`

- **Admin** (after approval):
  - Email: `admin@example.com`
  - Password: `admin123`

## 📞 Support

If you encounter issues:
1. Check the browser console for errors
2. Verify all environment variables are set
3. Ensure PostgreSQL is running
4. Check if database tables exist
5. Verify JWT token is valid
