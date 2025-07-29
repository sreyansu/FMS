'use client';

import { MessageSquare, Star, TrendingUp, Users } from 'lucide-react';

interface AnalyticsCardsProps {
  totalFeedback: number;
  averageRating: number;
    statusDistribution: Record<string, number>;
}

export default function AnalyticsCards({
  totalFeedback,
  averageRating,
  statusDistribution,
}: AnalyticsCardsProps) {
    const activeFeedback = statusDistribution['active'] || 0;
  const archivedFeedback = statusDistribution['archived'] || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-2 bg-blue-100 rounded-lg">
            <MessageSquare className="h-6 w-6 text-primary" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Feedback</p>
            <p className="text-2xl font-bold text-gray-900">{totalFeedback}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <Star className="h-6 w-6 text-yellow-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Average Rating</p>
            <p className="text-2xl font-bold text-gray-900">
              {averageRating.toFixed(1)}/5
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-2 bg-green-100 rounded-lg">
            <TrendingUp className="h-6 w-6 text-green-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Active Feedback</p>
            <p className="text-2xl font-bold text-gray-900">{activeFeedback}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Users className="h-6 w-6 text-gray-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Archived</p>
            <p className="text-2xl font-bold text-gray-900">{archivedFeedback}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
