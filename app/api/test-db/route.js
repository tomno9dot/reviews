// app/api/test-db/route.js
// DELETE THIS FILE after testing!

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

export async function GET() {
  try {
    // Check if URI exists
    if (!process.env.MONGODB_URI) {
      return NextResponse.json({
        success: false,
        error: 'MONGODB_URI is not set in .env.local',
        fix: 'Add MONGODB_URI=mongodb+srv://... to .env.local'
      }, { status: 500 });
    }

    // Check URI format
    const uri = process.env.MONGODB_URI;
    if (!uri.startsWith('mongodb+srv://') && 
        !uri.startsWith('mongodb://')) {
      return NextResponse.json({
        success: false,
        error: 'Wrong URI format',
        yourURI: uri.slice(0, 30) + '...',
        fix: 'URI must start with mongodb+srv://'
      }, { status: 500 });
    }

    // Try to connect
    await connectDB();

    return NextResponse.json({
      success: true,
      message: '✅ MongoDB connected successfully!',
      uriPreview: uri.slice(0, 20) + '...' + uri.slice(-20)
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
      type: error.code || 'UNKNOWN',
      fix: getFix(error.message)
    }, { status: 500 });
  }
}

function getFix(errorMessage) {
  if (errorMessage.includes('Invalid URL') || 
      errorMessage.includes('Unable to parse')) {
    return 'Your MONGODB_URI format is wrong. Must be: mongodb+srv://username:password@cluster.mongodb.net/dbname';
  }
  if (errorMessage.includes('ENOTFOUND')) {
    return 'Cannot reach MongoDB server. Check your cluster URL.';
  }
  if (errorMessage.includes('Authentication')) {
    return 'Wrong username or password in your MONGODB_URI';
  }
  if (errorMessage.includes('whitelist') || 
      errorMessage.includes('IP')) {
    return 'Your IP is not whitelisted. Go to MongoDB Atlas → Network Access → Allow 0.0.0.0/0';
  }
  return 'Check your MONGODB_URI in .env.local';
}