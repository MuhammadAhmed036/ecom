import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/database';
import { verifyToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Authorization header required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token) as any;

    if (!decoded) {
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      );
    }

    // Fetch orders for the authenticated user
    const result = await pool.query(`
      SELECT 
        id,
        order_number,
        total_amount,
        status,
        payment_status,
        shipping_address,
        created_at
      FROM orders 
      WHERE user_id = $1
      ORDER BY created_at DESC
    `, [decoded.userId]);

    return NextResponse.json({
      orders: result.rows,
    });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
