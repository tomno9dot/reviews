// review-saas/app/api/customers/[id]/route.js

import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/mobileAuth';
import Customer from '@/models/Customer';
import ReviewRequest from '@/models/ReviewRequest';

export async function DELETE(req, { params }) {
  try {
    const resolvedParams = await params;
    const user = await getAuthUser(req);

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const customer = await Customer.findOne({
      _id: resolvedParams.id,
      userId: user._id,
    });

    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    await Promise.all([
      Customer.findByIdAndDelete(resolvedParams.id),
      ReviewRequest.deleteMany({ customerId: resolvedParams.id }),
    ]);

    return NextResponse.json({
      success: true,
      message: 'Customer deleted',
    });

  } catch (error) {
    console.error('Delete customer error:', error.message);
    return NextResponse.json(
      { error: 'Failed to delete customer' },
      { status: 500 }
    );
  }
}