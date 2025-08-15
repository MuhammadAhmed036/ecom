import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/database';
import { verifyToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Get token from headers
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded || decoded.role !== 'superadmin') {
      return NextResponse.json(
        { message: 'Access denied. Super admin privileges required.' },
        { status: 403 }
      );
    }

    // Fetch all users
    const result = await pool.query(
      'SELECT id, name, email, phone, age, gender, role, is_approved, last_activity, created_at FROM users ORDER BY created_at DESC'
    );

    return NextResponse.json({
      users: result.rows,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
