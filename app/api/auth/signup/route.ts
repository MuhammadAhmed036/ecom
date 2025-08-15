import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/database';
import { hashPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, age, gender, password } = await request.json();

    // Validate required fields
    if (!name || !email || !phone || !age || !gender || !password) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Validate age
    if (age < 18 || age > 100) {
      return NextResponse.json(
        { message: 'Age must be between 18 and 100' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Insert new user
    const result = await pool.query(
      `INSERT INTO users (name, email, phone, age, gender, password, role, is_approved)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, name, email, phone, age, gender, role, is_approved, created_at`,
      [name, email, phone, age, gender, hashedPassword, 'admin', false]
    );

    const newUser = result.rows[0];

    return NextResponse.json({
      message: 'Registration successful. Please wait for admin approval.',
      user: newUser,
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
