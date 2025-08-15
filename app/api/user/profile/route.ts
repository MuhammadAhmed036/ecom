import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/database';
import { verifyToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET - Fetch user profile
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

    const result = await pool.query(
      `SELECT id, name, email, phone, age, gender, role, profile_image, 
              address_line1, address_line2, city, state, zip_code, country, 
              created_at, last_activity 
       FROM users WHERE id = $1`,
      [decoded.userId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update user profile
export async function PUT(request: NextRequest) {
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

    const formData = await request.formData();
    
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    const age = parseInt(formData.get('age') as string);
    const gender = formData.get('gender') as string;
    const address_line1 = formData.get('address_line1') as string;
    const address_line2 = formData.get('address_line2') as string;
    const city = formData.get('city') as string;
    const state = formData.get('state') as string;
    const zip_code = formData.get('zip_code') as string;
    const country = formData.get('country') as string;
    const profileImage = formData.get('profile_image') as File | null;

    // Validate required fields
    if (!name || !phone || !age || !gender) {
      return NextResponse.json(
        { message: 'Name, phone, age, and gender are required' },
        { status: 400 }
      );
    }

    // Handle profile image upload (for now, we'll store the file name)
    let profileImageUrl = null;
    if (profileImage) {
      // In a real application, you would upload to a cloud service like AWS S3
      // For now, we'll store a placeholder or the file name
      profileImageUrl = `uploads/${Date.now()}_${profileImage.name}`;
    }

    // Update user profile
    const updateFields = [];
    const updateValues = [];
    let paramCount = 1;

    updateFields.push(`name = $${paramCount++}`);
    updateValues.push(name);
    
    updateFields.push(`phone = $${paramCount++}`);
    updateValues.push(phone);
    
    updateFields.push(`age = $${paramCount++}`);
    updateValues.push(age);
    
    updateFields.push(`gender = $${paramCount++}`);
    updateValues.push(gender);
    
    updateFields.push(`address_line1 = $${paramCount++}`);
    updateValues.push(address_line1);
    
    updateFields.push(`address_line2 = $${paramCount++}`);
    updateValues.push(address_line2);
    
    updateFields.push(`city = $${paramCount++}`);
    updateValues.push(city);
    
    updateFields.push(`state = $${paramCount++}`);
    updateValues.push(state);
    
    updateFields.push(`zip_code = $${paramCount++}`);
    updateValues.push(zip_code);
    
    updateFields.push(`country = $${paramCount++}`);
    updateValues.push(country);
    
    if (profileImageUrl) {
      updateFields.push(`profile_image = $${paramCount++}`);
      updateValues.push(profileImageUrl);
    }
    
    updateFields.push(`updated_at = NOW()`);
    updateValues.push(decoded.userId);

    const result = await pool.query(
      `UPDATE users SET ${updateFields.join(', ')} WHERE id = $${paramCount} RETURNING id, name, email, phone, age, gender, role, profile_image, address_line1, address_line2, city, state, zip_code, country`,
      updateValues
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
