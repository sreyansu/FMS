'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import FormBuilder from '@/components/FormBuilder';

export default function EditFormPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchForm = async () => {
        try {
          const response = await fetch(`/api/forms/${id}`);
          if (!response.ok) {
            throw new Error('Failed to fetch form data');
          }
          const data = await response.json();
          setForm(data);
        } catch (error) {
          if (error instanceof Error) {
            toast.error(error.message);
          } else {
            toast.error('An unknown error occurred.');
          }
          router.push('/dashboard/forms');
        } finally {
          setLoading(false);
        }
      };
      fetchForm();
    }
  }, [id, router]);

  const handleSave = async (formData: any) => {
    try {
      const response = await fetch(`/api/forms/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update form');
      }

      toast.success('Form updated successfully!');
      router.push('/dashboard/forms');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('An unknown error occurred.');
      }
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading form...</div>;
  }

  if (!form) {
    return <div className="text-center py-12">Form not found.</div>;
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Form</h1>
      <FormBuilder existingForm={form} onSave={handleSave} />
    </div>
  );
}
