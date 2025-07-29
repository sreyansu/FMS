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

export async function POST(req: Request) {
  const session = await getServerSession(authOptions) as CustomSession | null;

  if (!session || !session.user || session.user.role !== 'admin') {
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
