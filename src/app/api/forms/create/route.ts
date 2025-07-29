import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Form from '@/models/Form';
import User from '@/models/User';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();

    const { title, description, fields } = await req.json();

    if (!title || !fields || !Array.isArray(fields) || fields.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newForm = new Form({
      title,
      description,
      fields,
      createdBy: session.user.id,
    });

    await newForm.save();

    return NextResponse.json(newForm, { status: 201 });
  } catch (error) {
    console.error('Form creation error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
