import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/database';
import { verifyToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const userId = parseInt(params.id);

    // Update user approval status
    const result = await pool.query(
      'UPDATE users SET is_approved = true WHERE id = $1 AND role = $2 RETURNING id, name, email',
      [userId, 'admin']
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { message: 'User not found or not an admin' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'User approved successfully',
      user: result.rows[0],
    });
  } catch (error) {
    console.error('Error approving user:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
