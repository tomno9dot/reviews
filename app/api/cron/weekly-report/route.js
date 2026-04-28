import { NextResponse } from 'next/server';
import { sendWeeklyReports } from '@/lib/weeklyReport';

export async function GET(req) {
  const authHeader = req.headers.get('authorization');
  
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    await sendWeeklyReports();
    return NextResponse.json({
      success: true,
      message: 'Weekly reports sent',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}