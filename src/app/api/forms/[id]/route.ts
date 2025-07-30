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

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions) as CustomSession | null;

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();

    const form = await Form.findById(params.id);

    if (!form) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 });
    }

    // Admins can see any form, users can only see active forms
    if (session.user.role !== 'admin' && form.status !== 'active') {
      return NextResponse.json({ error: 'Form not found or is not active' }, { status: 404 });
    }

    return NextResponse.json(form);
  } catch (error) {
    console.error(`Error fetching form ${params.id}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions) as CustomSession | null;

  if (!session || !session.user || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();

    const { title, description, fields } = await request.json();

    if (!title || !fields || !Array.isArray(fields) || fields.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const updatedForm = await Form.findByIdAndUpdate(
      params.id,
      { title, description, fields },
      { new: true }
    );

    if (!updatedForm) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 });
    }

    return NextResponse.json(updatedForm);
  } catch (error) {
    console.error(`Error updating form ${params.id}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions) as CustomSession | null;

  if (!session || !session.user || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();

    const deletedForm = await Form.findByIdAndDelete(params.id);

    if (!deletedForm) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Form deleted successfully' });
  } catch (error) {
    console.error(`Error deleting form ${params.id}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
