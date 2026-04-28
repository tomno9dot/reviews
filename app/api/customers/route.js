import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Customer from '@/models/Customer';

// GET - List customers
export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 20;

    await connectDB();

    const customers = await Customer
      .find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({ success: true, customers });

  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

// POST - Add customer
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { name, email, phone } = await req.json();

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check duplicate
    const exists = await Customer.findOne({
      userId: session.user.id,
      email: email.toLowerCase()
    });

    if (exists) {
      return NextResponse.json(
        { error: 'Customer with this email already exists' },
        { status: 409 }
      );
    }

    const customer = await Customer.create({
      userId: session.user.id,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone || ''
    });

    return NextResponse.json({
      success: true,
      customer: {
        ...customer.toObject(),
        _id: customer._id.toString()
      }
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to add customer' },
      { status: 500 }
    );
  }
}