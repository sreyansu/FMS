'use client';

import { useEffect, useState } from 'react';
import { BarChart3, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import { Bar, Pie } from 'react-chartjs-2';
import 'chart.js/auto';

import AdminRoute from '@/components/auth/AdminRoute';
import Button from '@/components/ui/Button';
import AnalyticsCards from '@/components/dashboard/AnalyticsCards';
import FeedbackTable from '@/components/dashboard/FeedbackTable';
import Loading from '@/components/ui/Loading';

interface RatingDistribution {
  _id: number;
  count: number;
}

interface FeedbackVolume {
  _id: string;
  count: number;
}

interface AnalyticsData {
  totalFeedback: number;
  averageRating: number;
  statusDistribution: Record<string, number>;
  ratingDistribution: RatingDistribution[];
  feedbackVolume: FeedbackVolume[];
}

export default function DashboardPage() {
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('/api/analytics');
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Failed to fetch analytics');
        }
        setAnalytics(result);
            } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error('An unknown error occurred while fetching analytics.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const handleExport = async () => {
    try {
      const response = await fetch('/api/export');

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Failed to export data');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `feedback-export-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
        } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('An unknown error occurred during export.');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" text="Loading Dashboard..." />
      </div>
    );
  }

  return (
    <AdminRoute>
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <BarChart3 className="h-8 w-8 mr-2 text-primary" /> Dashboard
          </h1>
          <Button variant="outline" onClick={handleExport} className="flex items-center">
            <Download className="h-5 w-5 mr-2 text-gray-500" /> Export CSV
          </Button>
        </div>

        {analytics && (
          <>
            <AnalyticsCards
              totalFeedback={analytics.totalFeedback}
              averageRating={analytics.averageRating}
              statusDistribution={analytics.statusDistribution}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Rating Distribution</h2>
                <Pie
                  data={getRatingChartData(analytics.ratingDistribution)}
                />
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Feedback Volume (Last 7 Days)</h2>
                <Bar
                  data={getVolumeChartData(analytics.feedbackVolume)}
                />
              </div>
            </div>

            <FeedbackTable />
          </>
        )}
      </div>
    </AdminRoute>
  );
}

function getRatingChartData(ratingDistribution: RatingDistribution[]) {
  return {
        labels: ratingDistribution.map((data) => `Rating ${data._id}`),
    datasets: [
      {
        data: ratingDistribution.map((data) => data.count),
        backgroundColor: ['#f59e0b', '#f97316', '#ef4444', '#dc2626', '#b91c1c'],
        hoverBackgroundColor: ['#fbbf24', '#fb923c', '#f87171', '#ef4444', '#dc2626'],
        borderWidth: 1,
      },
    ],
  };
}

function getVolumeChartData(feedbackVolume: FeedbackVolume[]) {
  return {
        labels: feedbackVolume.map((data) => data._id),
    datasets: [
      {
        label: 'Feedback Count',
        data: feedbackVolume.map((data) => data.count),
        backgroundColor: '#4f46e5',
        borderColor: '#4338ca',
        borderWidth: 1,
      },
    ],
  };
}

