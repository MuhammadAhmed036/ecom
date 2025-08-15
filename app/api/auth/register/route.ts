import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/database';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const age = parseInt(formData.get('age') as string);
    const gender = formData.get('gender') as string;
    const password = formData.get('password') as string;
    const role = formData.get('role') as string;
    const address_line1 = formData.get('address_line1') as string;
    const address_line2 = formData.get('address_line2') as string;
    const city = formData.get('city') as string;
    const state = formData.get('state') as string;
    const zip_code = formData.get('zip_code') as string;
    const country = formData.get('country') as string;
    const profileImage = formData.get('profile_image') as File | null;

    // Validate required fields
    if (!name || !email || !phone || !age || !gender || !password || !role) {
      return NextResponse.json(
        { message: 'All required fields are required' },
        { status: 400 }
      );
    }

    // Validate role
    const validRoles = ['customer', 'admin', 'head'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { message: 'Invalid role specified' },
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
    const hashedPassword = await bcrypt.hash(password, 12);

    // Handle profile image upload (for now, we'll store the file name)
    let profileImageUrl = null;
    if (profileImage) {
      // In a real application, you would upload to a cloud service like AWS S3
      // For now, we'll store a placeholder or the file name
      profileImageUrl = `uploads/${Date.now()}_${profileImage.name}`;
    }

    // Determine approval status based on role
    let isApproved = false;
    let actualRole = role;

    if (role === 'customer') {
      isApproved = true; // Customers are auto-approved
      actualRole = 'customer';
    } else if (role === 'admin') {
      isApproved = false; // Admins need approval
      actualRole = 'admin';
    } else if (role === 'head') {
      isApproved = false; // Head users need approval
      actualRole = 'superadmin';
    }

    // Insert new user with all fields
    const result = await pool.query(`
      INSERT INTO users (
        name, email, phone, age, gender, password, role, is_approved, 
        profile_image, address_line1, address_line2, city, state, zip_code, country,
        last_activity, created_at, updated_at
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW(), NOW(), NOW()) 
      RETURNING id, name, email, role, is_approved, profile_image
    `, [
      name, email, phone, age, gender, hashedPassword, actualRole, isApproved,
      profileImageUrl, address_line1, address_line2, city, state, zip_code, country
    ]);

    const newUser = result.rows[0];

    return NextResponse.json({
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        isApproved: newUser.is_approved,
        profileImage: newUser.profile_image
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
