import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import type { Session } from 'next-auth';

import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Form from '@/models/Form';

interface CustomSession extends Session {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export async function PATCH(
  request: Request,
  segmentData: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions) as CustomSession | null;

  if (!session || !session.user || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { status } = await request.json();
    if (!['active', 'closed'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    await connectDB();

    const params = await segmentData.params;
    const updatedForm = await Form.findByIdAndUpdate(
      params.id,
      { status },
      { new: true }
    );

    if (!updatedForm) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 });
    }

    return NextResponse.json(updatedForm);
  } catch (error) {
    console.error('Error updating form status:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
