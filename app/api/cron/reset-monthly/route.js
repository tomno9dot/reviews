import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(req) {
  const authHeader = req.headers.get('authorization');

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    await connectDB();

    // Reset all users' monthly counters
    const result = await User.updateMany(
      {},
      {
        $set: {
          reviewRequestsSentThisMonth: 0,
          lastResetDate: new Date()
        }
      }
    );

    return NextResponse.json({
      success: true,
      message: `Reset ${result.modifiedCount} users' monthly counts`,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}