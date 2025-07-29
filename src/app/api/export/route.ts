import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import type { Session } from 'next-auth';
import connectDB from '@/lib/mongodb';
import Feedback from '@/models/Feedback';
import { authOptions } from '@/lib/auth';

interface CustomSession extends Session {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export async function GET() {
  try {
    await connectDB();
    
    const session = await getServerSession(authOptions) as CustomSession | null;
    
    if (!session || !session.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const feedback = await Feedback.find({})
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    // Convert to CSV format
    const csvHeaders = 'Name,Email,Rating,Message,Status,Submitted Date\n';
    
    const csvData = feedback.map(item => {
      const date = new Date(item.createdAt).toLocaleDateString();
      return `"${item.name}","${item.email}",${item.rating},"${item.message.replace(/"/g, '""')}","${item.status}","${date}"`;
    }).join('\n');

    const csv = csvHeaders + csvData;

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="feedback-export-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });

  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
