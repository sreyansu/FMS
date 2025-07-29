import { NextResponse } from 'next/server';

import connectDB from '@/lib/mongodb';
import Form from '@/models/Form';

export async function GET(
  request: Request,
  segmentData: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const params = await segmentData.params;
    const form = await Form.findById(params.id);

    if (!form || form.status !== 'active') {
      return NextResponse.json({ error: 'Form not found or is not active' }, { status: 404 });
    }

    return NextResponse.json(form);
  } catch (error) {
    console.error('Error fetching form:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
