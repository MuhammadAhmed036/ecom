import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

export const dynamic = 'force-dynamic';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:1234@localhost:5432/ecommerce_db',
});

export async function GET(request: NextRequest) {
  try {
    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') || 'newest';
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build the query
    let query = `
      SELECT id, name, description, price, category, subcategory, image_url, stock_quantity, created_at 
      FROM products 
      WHERE 1=1
    `;
    const params: any[] = [];

    // Add category filter
    if (category && category !== 'all') {
      query += ` AND category = $${params.length + 1}`;
      params.push(category);
    }

    // Add search filter
    if (search) {
      query += ` AND (name ILIKE $${params.length + 1} OR description ILIKE $${params.length + 1})`;
      params.push(`%${search}%`);
    }

    // Add sorting
    switch (sort) {
      case 'newest':
        query += ' ORDER BY created_at DESC';
        break;
      case 'oldest':
        query += ' ORDER BY created_at ASC';
        break;
      case 'price-low':
        query += ' ORDER BY price ASC';
        break;
      case 'price-high':
        query += ' ORDER BY price DESC';
        break;
      case 'name':
        query += ' ORDER BY name ASC';
        break;
      default:
        query += ' ORDER BY created_at DESC';
    }

    // Add pagination
    query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    return NextResponse.json({
      products: result.rows,
      total: result.rows.length,
      limit,
      offset
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
