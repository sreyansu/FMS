'use client';

import { useEffect, useState } from 'react';
import { Table, Tr, Th, Td } from '@/components/ui/Table';
import { Trash, Archive, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import Loading from '@/components/ui/Loading';
import Button from '@/components/ui/Button';

interface Feedback {
  _id: string;
  name: string;
  email: string;
  rating: number;
  message: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function FeedbackTable() {
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await fetch('/api/feedback');
        const { feedback } = await response.json();

        if (!response.ok) {
          throw new Error('Failed to fetch feedback');
        }

        setFeedbackList(feedback);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to fetch feedback');
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/feedback/${id}`, { method: 'DELETE' });

      if (!response.ok) {
        throw new Error('Failed to delete feedback');
      }

      setFeedbackList(feedbackList.filter((item) => item._id !== id));
      toast.success('Feedback deleted successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete feedback');
    }
  };

  const handleArchiveToggle = async (id: string, status: string) => {
    try {
      const newStatus = status === 'active' ? 'archived' : 'active';
      const response = await fetch(`/api/feedback/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      const updatedItem = await response.json();

      setFeedbackList(
        feedbackList.map((item) =>
          item._id === id ? { ...item, status: updatedItem.feedback.status } : item
        )
      );

      toast.success(`Feedback ${newStatus === 'active' ? 'unarchived' : 'archived'} successfully`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loading size="lg" text="Loading Feedback..." />
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-auto">
      <Table>
        <thead>
          <Tr>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Rating</Th>
            <Th>Date</Th>
            <Th>Status</Th>
            <Th>Action</Th>
          </Tr>
        </thead>
        <tbody>
          {feedbackList.map((feedback) => (
            <Tr key={feedback._id}>
              <Td>{feedback.name}</Td>
              <Td>{feedback.email}</Td>
              <Td>{feedback.rating} / 5</Td>
              <Td>{new Date(feedback.createdAt).toLocaleDateString()}</Td>
              <Td>
                <span
                  className={`${feedback.status === 'active'
                      ? 'text-green-500'
                      : 'text-gray-500'
                    }`}
                >
                  {feedback.status}
                </span>
              </Td>
              <Td className="space-x-2">
                <Button
                  variant="outline"
                  onClick={() => handleArchiveToggle(feedback._id, feedback.status)}
                  size="sm"
                  className="flex items-center space-x-1"
                >
                  {feedback.status === 'active' ? (
                    <Archive className="h-4 w-4" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  <span>Toggle</span>
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(feedback._id)}
                  size="sm"
                  className="flex items-center space-x-1"
                >
                  <Trash className="h-4 w-4" />
                  <span>Delete</span>
                </Button>
              </Td>
            </Tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
