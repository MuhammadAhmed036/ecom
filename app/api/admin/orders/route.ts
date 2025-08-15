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

    if (!decoded || decoded.role !== 'superadmin') {
      return NextResponse.json(
        { message: 'Super admin access required' },
        { status: 403 }
      );
    }

    // Fetch orders with user information
    const result = await pool.query(`
      SELECT 
        o.id,
        o.user_id,
        o.order_number,
        o.total_amount,
        o.status,
        o.payment_status,
        o.created_at,
        u.name as user_name,
        u.email as user_email
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `);

    return NextResponse.json({
      orders: result.rows,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
