import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Customer from '@/models/Customer';
import ReviewRequest from '@/models/ReviewRequest';

// DELETE customer
export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    await connectDB();

    // Make sure customer belongs to this user
    const customer = await Customer.findOne({
      _id: params.id,
      userId: session.user.id
    });

    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    // Delete customer and their review requests
    await Promise.all([
      Customer.findByIdAndDelete(params.id),
      ReviewRequest.deleteMany({ customerId: params.id })
    ]);

    return NextResponse.json({ 
      success: true,
      message: 'Customer deleted' 
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete customer' },
      { status: 500 }
    );
  }
}