import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Customer from '@/models/Customer';

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    const text = await file.text();
    const lines = text.split('\n').filter(line => line.trim());
    
    if (lines.length < 2) {
      return NextResponse.json(
        { error: 'CSV file is empty or invalid' },
        { status: 400 }
      );
    }

    const headers = lines[0].split(',')
      .map(h => h.trim().toLowerCase().replace(/"/g, ''));
    
    const nameIdx = headers.indexOf('name');
    const emailIdx = headers.indexOf('email');
    const phoneIdx = headers.indexOf('phone');

    if (nameIdx === -1 || emailIdx === -1) {
      return NextResponse.json(
        { error: 'CSV must have "Name" and "Email" columns' },
        { status: 400 }
      );
    }

    await connectDB();

    let imported = 0;
    let duplicates = 0;
    let failed = 0;

    // Process max 500 rows
    const dataRows = lines.slice(1, 501);

    for (const line of dataRows) {
      try {
        const cols = line.split(',')
          .map(c => c.trim().replace(/"/g, ''));
        
        const name = cols[nameIdx];
        const email = cols[emailIdx]?.toLowerCase();
        const phone = phoneIdx !== -1 ? cols[phoneIdx] || '' : '';

        if (!name || !email || !/\S+@\S+\.\S+/.test(email)) {
          failed++;
          continue;
        }

        // Check for existing customer
        const exists = await Customer.findOne({
          userId: session.user.id,
          email
        });

        if (exists) {
          duplicates++;
          continue;
        }

        await Customer.create({
          userId: session.user.id,
          name,
          email,
          phone
        });

        imported++;

      } catch (err) {
        failed++;
      }
    }

    return NextResponse.json({
      success: true,
      imported,
      duplicates,
      failed,
      total: dataRows.length
    });

  } catch (error) {
    console.error('Bulk import error:', error);
    return NextResponse.json(
      { error: 'Import failed' },
      { status: 500 }
    );
  }
}