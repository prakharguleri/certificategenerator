import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import User from '@/lib/user';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    await connectToDB();
    const existingUser = await User.findOne({ email }).exec();

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await User.create({
      email,
      password: hashedPassword,
      name,
      approved: false,
    });

    return NextResponse.json(
      { message: 'Registration successful. Awaiting admin approval before login.' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'An error occurred during registration' }, { status: 500 });
  }
}
