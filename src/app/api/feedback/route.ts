import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import Feedback from '@/models/Feedback';
import { authOptions } from '@/lib/auth';

// GET all feedback (admin only) or create new feedback
export async function GET(request: Request) {
  try {
    await connectDB();
    
    const session = await getServerSession(authOptions);
    
    // Only admins can view all feedback
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const rating = searchParams.get('rating');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build query
    const query: any = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } },
      ];
    }

    if (rating) {
      query.rating = parseInt(rating);
    }

    // Build sort object
    const sort: any = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const skip = (page - 1) * limit;

    const [feedback, total] = await Promise.all([
      Feedback.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('userId', 'name email'),
      Feedback.countDocuments(query),
    ]);

    return NextResponse.json({
      feedback,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
      },
    });

  } catch (error) {
    console.error('Get feedback error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new feedback
export async function POST(request: Request) {
  try {
    const { name, email, rating, message } = await request.json();

    // Validate required fields
    if (!name || !email || !rating || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    await connectDB();

    const session = await getServerSession(authOptions);
    
    const feedback = await Feedback.create({
      name,
      email,
      rating: parseInt(rating),
      message,
      userId: session?.user?.id || null,
    });

    return NextResponse.json(
      { 
        message: 'Feedback submitted successfully',
        feedback 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Create feedback error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
