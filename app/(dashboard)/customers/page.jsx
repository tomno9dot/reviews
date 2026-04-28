// app/(dashboard)/customers/page.jsx

import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Customer from '@/models/Customer';
import ReviewRequest from '@/models/ReviewRequest';
import CustomersClient from '@/components/customers/CustomersClient';

export default async function CustomersPage({ searchParams }) {
  const params = await searchParams;

  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/login');
  }

  await connectDB();

  const page = parseInt(params?.page || '1');
  const search = params?.search || '';
  const limit = 20;
  const skip = (page - 1) * limit;

  const query = { userId: session.user.id };
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
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

  const customerIds = customers.map((c) => c._id);

  const requestCounts = await ReviewRequest.aggregate([
    {
      $match: {
        customerId: { $in: customerIds },
      },
    },
    {
      $group: {
        _id: '$customerId',
        count: { $sum: 1 },
        lastSent: { $max: '$sentAt' },
      },
    },
  ]);

  // ✅ Convert ALL fields to plain serializable values
  const serializedCustomers = customers.map((customer) => {
    const reqData = requestCounts.find(
      (r) => r._id.toString() === customer._id.toString()
    );

    return {
      // ✅ Convert ObjectId to string
      _id: customer._id.toString(),

      // ✅ Convert userId ObjectId to string
      userId: customer.userId
        ? customer.userId.toString()
        : '',

      // ✅ Plain string fields
      name: customer.name || '',
      email: customer.email || '',
      phone: customer.phone || '',

      // ✅ Plain boolean
      reviewRequestSent: customer.reviewRequestSent || false,
      emailOpened: customer.emailOpened || false,
      reviewLeft: customer.reviewLeft || false,

      // ✅ Convert Date to ISO string or null
      sentAt: customer.sentAt
        ? customer.sentAt.toISOString()
        : null,
      createdAt: customer.createdAt
        ? customer.createdAt.toISOString()
        : null,
      updatedAt: customer.updatedAt
        ? customer.updatedAt.toISOString()
        : null,

      // ✅ Plain number
      __v: customer.__v || 0,

      // ✅ Request count stats
      requestCount: reqData?.count || 0,
      lastRequestSent: reqData?.lastSent
        ? reqData.lastSent.toISOString()
        : null,
    };
  });

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <CustomersClient
      customers={serializedCustomers}
      totalCount={totalCount}
      currentPage={page}
      totalPages={totalPages}
      search={search}
    />
  );
}