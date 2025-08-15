import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:1234@localhost:5432/ecommerce_db',
});

// Helper function to verify JWT token
const verifyToken = (token: string) => {
  try {
    const jwtSecret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';
    return jwt.verify(token, jwtSecret) as any;
  } catch (error) {
    console.error('JWT verification error:', error);
    return null;
  }
};

// GET - Fetch all products (for admin/superadmin)
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    
    if (!decoded || (decoded.role !== 'admin' && decoded.role !== 'superadmin')) {
      return NextResponse.json({ message: 'Access denied' }, { status: 403 });
    }

    const result = await pool.query(`
      SELECT id, name, description, price, category, subcategory, image_url, stock_quantity, created_at, updated_at
      FROM products 
      ORDER BY created_at DESC
    `);

    return NextResponse.json({ products: result.rows });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// POST - Add new product
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    
    if (!decoded || (decoded.role !== 'admin' && decoded.role !== 'superadmin')) {
      return NextResponse.json({ message: 'Access denied' }, { status: 403 });
    }

    const { name, description, price, category, subcategory, image_url, stock_quantity } = await request.json();

    // Validate required fields
    if (!name || !price || !category) {
      return NextResponse.json({ message: 'Name, price, and category are required' }, { status: 400 });
    }

    const result = await pool.query(`
      INSERT INTO products (name, description, price, category, subcategory, image_url, stock_quantity, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
      RETURNING id, name, description, price, category, subcategory, image_url, stock_quantity, created_at
    `, [name, description, price, category, subcategory, image_url, stock_quantity || 0]);

    return NextResponse.json({ 
      message: 'Product added successfully',
      product: result.rows[0]
    }, { status: 201 });

  } catch (error) {
    console.error('Error adding product:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
