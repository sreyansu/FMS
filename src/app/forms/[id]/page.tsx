'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';

interface Field {
  _id: string;
  type: 'text' | 'textarea' | 'rating' | 'radio';
  label: string;
  options?: string[];
}

interface IForm {
  _id: string;
  title: string;
  description: string;
  fields: Field[];
}

export default function SingleFormPage() {
  const params = useParams();
  const { id } = params;

  const [form, setForm] = useState<IForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchForm = async () => {
        try {
          const response = await fetch(`/api/forms/${id}`);
          if (!response.ok) {
            throw new Error('Form not found or is no longer active.');
          }
          const data = await response.json();
          setForm(data);
        } catch (err) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError('An unknown error occurred.');
          }
        } finally {
          setLoading(false);
        }
      };

      fetchForm();
    }
  }, [id]);

  const renderField = (field: Field) => {
    switch (field.type) {
      case 'text':
        return <input type="text" className="w-full p-2 border rounded-md" />;
      case 'textarea':
        return <textarea className="w-full p-2 border rounded-md" rows={4}></textarea>;
      case 'rating':
        return (
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map(value => (
              <button key={value} type="button" className="p-2 border rounded-md hover:bg-gray-100">{value}</button>
            ))}
          </div>
        );
      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map(option => (
              <div key={option} className="flex items-center">
                <input type="radio" name={field._id} value={option} className="mr-2" />
                <label>{option}</label>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return <div className="text-center py-20">Loading form...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-600">{error}</div>;
  }

  if (!form) {
    return <div className="text-center py-20">Form not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{form.title}</h1>
        <p className="text-gray-600 mb-8">{form.description}</p>

        <form onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-6">
            {form.fields.map(field => (
              <div key={field._id}>
                <label className="block text-lg font-medium text-gray-800 mb-2">{field.label}</label>
                {renderField(field)}
              </div>
            ))}
          </div>

          <div className="mt-8">
            <Button type="submit" className="w-full">Submit Feedback</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
