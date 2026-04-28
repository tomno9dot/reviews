// review-saas/app/api/customers/route.js

import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/mobileAuth';
import Customer from '@/models/Customer';

export async function GET(req) {
  try {
    // ✅ Works for BOTH web (NextAuth) and mobile (Bearer token)
    const user = await getAuthUser(req);

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const search = searchParams.get('search') || '';
    const limit = 20;
    const skip = (page - 1) * limit;

    const query = { userId: user._id };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const [customers, totalCount] = await Promise.all([
      Customer.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Customer.countDocuments(query),
    ]);

    // ✅ Serialize for mobile
    const serialized = customers.map((c) => ({
      _id: c._id.toString(),
      userId: c.userId ? c.userId.toString() : '',
      name: c.name || '',
      email: c.email || '',
      phone: c.phone || '',
      reviewRequestSent: c.reviewRequestSent || false,
      sentAt: c.sentAt ? c.sentAt.toISOString() : null,
      createdAt: c.createdAt ? c.createdAt.toISOString() : null,
    }));

    return NextResponse.json({
      success: true,
      customers: serialized,
      totalCount,
      page,
    });

  } catch (error) {
    console.error('Customers GET error:', error.message);
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const user = await getAuthUser(req);

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    let body;
    try {
      body = await req.json();
    } catch (e) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const name = (body.name || '').trim();
    const email = (body.email || '').toLowerCase().trim();
    const phone = (body.phone || '').trim();

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    const exists = await Customer.findOne({
      userId: user._id,
      email,
    });

    if (exists) {
      return NextResponse.json(
        { error: 'Customer already exists' },
        { status: 409 }
      );
    }

    const customer = await Customer.create({
      userId: user._id,
      name,
      email,
      phone,
    });

    return NextResponse.json(
      {
        success: true,
        customer: {
          _id: customer._id.toString(),
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
        },
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Customers POST error:', error.message);
    return NextResponse.json(
      { error: 'Failed to create customer' },
      { status: 500 }
    );
  }
}