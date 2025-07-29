'use client';

import { useEffect, useState } from 'react';
import { Plus, FileText, Hash } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

import Button from '@/components/ui/Button';

interface IForm {
  _id: string;
  title: string;
  description: string;
  fields: any[];
  createdAt: string;
}

export default function FormsPage() {
  const [forms, setForms] = useState<IForm[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await fetch('/api/forms');
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

    fetchForms();
  }, []);
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Manage Forms</h1>
        <Link href="/dashboard/forms/create">
          <Button className="flex items-center">
            <Plus className="h-5 w-5 mr-2" /> Create Form
          </Button>
        </Link>
      </div>
            {loading ? (
        <div className="text-center text-gray-500">Loading forms...</div>
      ) : forms.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {forms.map((form) => (
            <div key={form._id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-bold text-gray-900 mb-2">{form.title}</h2>
              <p className="text-gray-600 mb-4 h-12 overflow-hidden">{form.description}</p>
              <div className="flex items-center text-sm text-gray-500">
                <FileText className="h-4 w-4 mr-2" />
                <span>{new Date(form.createdAt).toLocaleDateString()}</span>
                <Hash className="h-4 w-4 mx-2" />
                <span>{form.fields.length} fields</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <p className="text-gray-500">No forms created yet.</p>
        </div>
      )}
    </div>
  );
}
