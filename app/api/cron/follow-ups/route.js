import { NextResponse } from 'next/server';
import { sendFollowUpEmails } from '@/lib/followup';

// Secure cron endpoint
export async function GET(req) {
  // Verify cron secret
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    await sendFollowUpEmails();
    return NextResponse.json({ 
      success: true,
      message: 'Follow-up emails sent',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}