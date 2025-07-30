'use client';

import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import FormBuilder from '@/components/FormBuilder';

export default function CreateFormPage() {
  const router = useRouter();

  const handleSave = async (formData: any) => {
    try {
      const response = await fetch('/api/forms/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save the form.');
      }

      toast.success('Form created successfully!');
      router.push('/dashboard/forms');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('An unexpected error occurred.');
      }
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Create New Form</h1>
      <FormBuilder onSave={handleSave} />
    </div>
  );
}
