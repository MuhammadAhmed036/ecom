import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/database';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

// Helper function to verify JWT token
const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!);
  } catch (error) {
    return null;
  }
};

// DELETE - Delete a user/employee
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get authorization header
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

    const userId = parseInt(params.id);
    if (isNaN(userId)) {
      return NextResponse.json(
        { message: 'Invalid user ID' },
        { status: 400 }
      );
    }

    // Check if user exists and is an admin
    const userCheck = await pool.query(
      'SELECT id, role FROM users WHERE id = $1',
      [userId]
    );

    if (userCheck.rows.length === 0) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    const user = userCheck.rows[0];
    if (user.role !== 'admin') {
      return NextResponse.json(
        { message: 'Can only delete admin users' },
        { status: 403 }
      );
    }

    // Delete the user
    await pool.query('DELETE FROM users WHERE id = $1', [userId]);

    return NextResponse.json(
      { message: 'User deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
