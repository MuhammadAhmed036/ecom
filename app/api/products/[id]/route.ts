import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:1234@localhost:5432/ecommerce_db',
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = parseInt(params.id);
    
    if (isNaN(productId)) {
      return NextResponse.json(
        { message: 'Invalid product ID' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      'SELECT id, name, description, price, category, subcategory, image_url, stock_quantity, created_at, updated_at FROM products WHERE id = $1',
      [productId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      product: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
