'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { FileText, ArrowRight } from 'lucide-react';

interface IForm {
  _id: string;
  title: string;
  description: string;
}

export default function FormsPage() {
  const [forms, setForms] = useState<IForm[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActiveForms = async () => {
      try {
        const response = await fetch('/api/forms/public');
        if (!response.ok) {
          throw new Error('Failed to fetch forms');
        }
        const data = await response.json();
        setForms(data);
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error('An unknown error occurred.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchActiveForms();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-4">Available Forms</h1>
        <p className="text-lg text-center text-gray-600 mb-8">Select a form to provide your feedback.</p>

        {loading ? (
          <div className="text-center text-gray-500">Loading forms...</div>
        ) : forms.length > 0 ? (
          <div className="space-y-4">
            {forms.map((form) => (
              <Link href={`/forms/${form._id}`} key={form._id}>
                <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">{form.title}</h2>
                    <p className="text-gray-500 mt-1">{form.description}</p>
                  </div>
                  <ArrowRight className="h-6 w-6 text-gray-400" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-lg shadow-sm text-center">
            <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-800">No Active Forms</h2>
            <p className="text-gray-500 mt-1">There are currently no active forms available. Please check back later.</p>
          </div>
        )}
      </div>
    </div>
  );
}
