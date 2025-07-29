import { NextResponse } from 'next/server';

import connectDB from '@/lib/mongodb';
import Form from '@/models/Form';

export async function GET() {
  try {
    await connectDB();

    const forms = await Form.find({ status: 'active' }).sort({ createdAt: -1 });

    return NextResponse.json(forms);
  } catch (error) {
    console.error('Error fetching active forms:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
