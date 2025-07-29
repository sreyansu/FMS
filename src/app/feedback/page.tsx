'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { MessageSquare, Send } from 'lucide-react';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import StarRating from '@/components/ui/StarRating';
import { feedbackSchema, FeedbackInput } from '@/lib/validations';

export default function FeedbackPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<FeedbackInput>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      rating: 0,
    },
  });

  const onSubmit = async (data: FeedbackInput) => {
    if (data.rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || 'Something went wrong');
        return;
      }

      toast.success('Thank you for your feedback!');
      reset();
      
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <MessageSquare className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            We Value Your Feedback
          </h1>
          <p className="text-lg text-gray-600">
            Help us improve by sharing your thoughts and experiences. Your feedback matters to us.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Input
                label="Your Name"
                type="text"
                placeholder="Enter your full name"
                {...register('name')}
                error={errors.name?.message}
              />

              <Input
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                {...register('email')}
                error={errors.email?.message}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Overall Rating
              </label>
              <Controller
                name="rating"
                control={control}
                render={({ field }) => (
                  <div className="flex items-center space-x-4">
                    <StarRating
                      value={field.value}
                      onChange={field.onChange}
                      size="lg"
                    />
                    <span className="text-sm text-gray-600">
                      {field.value > 0 ? `${field.value}/5` : 'Select rating'}
                    </span>
                  </div>
                )}
              />
              {errors.rating && (
                <p className="mt-1 text-sm text-red-600">{errors.rating.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Message
              </label>
              <textarea
                {...register('message')}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Please share your detailed feedback, suggestions, or any issues you've encountered..."
              />
              {errors.message && (
                <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button
                type="submit"
                loading={isLoading}
                className="flex-1 flex items-center justify-center space-x-2"
                size="lg"
              >
                <Send className="h-4 w-4" />
                <span>Submit Feedback</span>
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={() => reset()}
                className="flex-1"
                size="lg"
              >
                Clear Form
              </Button>
            </div>
          </form>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Your feedback is important to us and helps us improve our services.
            Thank you for taking the time to share your thoughts!
          </p>
        </div>
      </div>
    </div>
  );
}
