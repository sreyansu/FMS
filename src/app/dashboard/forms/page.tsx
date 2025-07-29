'use client';

import { useEffect, useState } from 'react';
import { Plus, FileText, Hash } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

import Button from '@/components/ui/Button';

import Switch from '@/components/ui/Switch';

interface IForm {
  _id: string;
  title: string;
  description: string;
  fields: any[];
  createdAt: string;
  status: 'active' | 'closed';
}

export default function FormsPage() {
    const [forms, setForms] = useState<IForm[]>([]);
  const [loading, setLoading] = useState(true);

  const handleStatusChange = async (formId: string, newStatus: 'active' | 'closed') => {
    const originalForms = [...forms];
    const updatedForms = forms.map(form => 
      form._id === formId ? { ...form, status: newStatus } : form
    );
    setForms(updatedForms);

    try {
      const response = await fetch(`/api/forms/${formId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update form status');
      }

      toast.success(`Form status updated to ${newStatus}`);
    } catch (error) {
      setForms(originalForms);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('An unknown error occurred.');
      }
    }
  };

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
                        <div key={form._id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow flex flex-col">
              <div className="flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-bold text-gray-900">{form.title}</h2>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${form.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {form.status}
                  </span>
                </div>
                <p className="text-gray-600 mb-4 h-12 overflow-hidden">{form.description}</p>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-500 mt-4 pt-4 border-t">
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  <span>{new Date(form.createdAt).toLocaleDateString()}</span>
                  <Hash className="h-4 w-4 mx-2" />
                  <span>{form.fields.length} fields</span>
                </div>
                <Switch 
                  checked={form.status === 'active'}
                                    onCheckedChange={(checked: boolean) => handleStatusChange(form._id, checked ? 'active' : 'closed')}
                />
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
