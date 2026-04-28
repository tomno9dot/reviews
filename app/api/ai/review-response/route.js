import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { generateMultipleResponses } from '@/lib/aiResponses';

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { reviewText, rating } = await req.json();

    if (!reviewText) {
      return NextResponse.json(
        { error: 'Review text is required' },
        { status: 400 }
      );
    }

    await connectDB();
    const user = await User.findById(session.user.id);

    // AI responses are Pro feature
    if (user.plan === 'free') {
      return NextResponse.json(
        { 
          error: 'AI responses require Starter or Pro plan',
          upgradeRequired: true
        },
        { status: 403 }
      );
    }

    const responses = await generateMultipleResponses({
      reviewText,
      rating: parseInt(rating) || 5,
      businessName: user.businessName,
      businessType: user.businessType
    });

    return NextResponse.json({
      success: true,
      responses
    });

  } catch (error) {
    console.error('AI response error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}