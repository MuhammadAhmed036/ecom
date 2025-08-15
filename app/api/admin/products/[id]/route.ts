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

// PUT - Update product
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const productId = parseInt(params.id);
    if (isNaN(productId)) {
      return NextResponse.json({ message: 'Invalid product ID' }, { status: 400 });
    }

    const { name, description, price, category, subcategory, image_url, stock_quantity } = await request.json();

    // Validate required fields
    if (!name || !price || !category) {
      return NextResponse.json({ message: 'Name, price, and category are required' }, { status: 400 });
    }

    // Check if product exists
    const existingProduct = await pool.query('SELECT id FROM products WHERE id = $1', [productId]);
    if (existingProduct.rows.length === 0) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    const result = await pool.query(`
      UPDATE products 
      SET name = $1, description = $2, price = $3, category = $4, subcategory = $5, image_url = $6, stock_quantity = $7, updated_at = NOW()
      WHERE id = $8
      RETURNING id, name, description, price, category, subcategory, image_url, stock_quantity, updated_at
    `, [name, description, price, category, subcategory, image_url, stock_quantity || 0, productId]);

    return NextResponse.json({ 
      message: 'Product updated successfully',
      product: result.rows[0]
    });

  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete product
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const productId = parseInt(params.id);
    if (isNaN(productId)) {
      return NextResponse.json({ message: 'Invalid product ID' }, { status: 400 });
    }

    // Check if product exists
    const existingProduct = await pool.query('SELECT id FROM products WHERE id = $1', [productId]);
    if (existingProduct.rows.length === 0) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    // Delete the product
    await pool.query('DELETE FROM products WHERE id = $1', [productId]);

    return NextResponse.json({ message: 'Product deleted successfully' });

  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
