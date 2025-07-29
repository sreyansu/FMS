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
    <div className="container py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Manage Forms</h1>
        <Link href="/dashboard/forms/create">
          <Button>
            <Plus className="h-5 w-5 mr-2" /> Create Form
          </Button>
        </Link>
      </div>
      {loading ? (
        <div className="text-center text-muted-foreground">Loading forms...</div>
      ) : forms.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {forms.map((form) => (
            <div key={form._id} className="bg-card border rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col">
              <div className="p-6 flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-bold text-card-foreground truncate pr-2">{form.title}</h2>
                  <span
                    className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${form.status === 'active' ? 'bg-green-500/10 text-green-700 dark:text-green-400' : 'bg-destructive/10 text-destructive'}`}>
                    {form.status}
                  </span>
                </div>
                <p className="text-muted-foreground mb-4 h-12 overflow-hidden text-ellipsis">{form.description}</p>
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground p-6 pt-4 border-t">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5"><FileText className="h-4 w-4" />{new Date(form.createdAt).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1.5"><Hash className="h-4 w-4" />{form.fields.length} fields</span>
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
        <div className="bg-card border rounded-lg shadow-sm p-12 text-center">
          <h3 className="text-xl font-semibold text-foreground mb-2">No forms created yet.</h3>
          <p className="text-muted-foreground mb-4">Get started by creating your first form.</p>
          <Link href="/dashboard/forms/create">
            <Button>
              <Plus className="h-5 w-5 mr-2" /> Create Form
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
