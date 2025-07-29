'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Plus, Trash2, GripVertical } from 'lucide-react';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/textarea'; // Corrected import

type FieldType = 'text' | 'textarea' | 'rating' | 'radio';

interface Field {
  id: number;
  type: FieldType;
  label: string;
  options?: string[];
}

const fieldTypes: { value: FieldType; label: string }[] = [
  { value: 'text', label: 'Text Input' },
  { value: 'textarea', label: 'Text Area' },
  { value: 'rating', label: 'Star Rating' },
  { value: 'radio', label: 'Multiple Choice' },
];

export default function CreateFormPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fields, setFields] = useState<Field[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const addField = (type: FieldType) => {
    const newField: Field = {
      id: Date.now(),
      type,
      label: '',
      options: type === 'radio' ? [''] : [],
    };
    setFields([...fields, newField]);
  };

  const updateField = (id: number, updatedField: Partial<Field>) => {
    setFields(fields.map((field) => (field.id === id ? { ...field, ...updatedField } : field)));
  };

  const removeField = (id: number) => {
    setFields(fields.filter((field) => field.id !== id));
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('Form title is required.');
      return;
    }
    if (fields.length === 0) {
      toast.error('Please add at least one field to the form.');
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch('/api/forms/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description, fields }),
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
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-8">Create New Form</h1>

        <div className="bg-card border rounded-lg shadow-sm space-y-6 p-8 mb-8">
          <Input
            label="Form Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Customer Feedback Survey"
            className="text-lg"
          />
          <Textarea
            label="Description (Optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="A brief description to guide your users."
          />
        </div>

        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground mb-6">Form Fields</h2>
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="bg-card border p-6 rounded-lg shadow-sm flex items-start gap-4">
                <GripVertical className="h-6 w-6 text-muted-foreground mt-9 cursor-move" />
                <div className="flex-grow space-y-4">
                  <Input
                    label={`Field ${index + 1} Label`}
                    value={field.label}
                    onChange={(e) => updateField(field.id, { label: e.target.value })}
                    placeholder="What question do you want to ask?"
                  />
                  {field.type === 'radio' && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Options</h4>
                      <div className="space-y-2">
                        {field.options?.map((option, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <Input
                              value={option}
                              onChange={(e) => {
                                const newOptions = [...(field.options || [])];
                                newOptions[i] = e.target.value;
                                updateField(field.id, { options: newOptions });
                              }}
                              placeholder={`Option ${i + 1}`}
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                const newOptions = (field.options || []).filter((_, idx) => idx !== i);
                                updateField(field.id, { options: newOptions });
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-3"
                        onClick={() => updateField(field.id, { options: [...(field.options || []), ''] })}
                      >
                        <Plus className="h-4 w-4 mr-2" /> Add Option
                      </Button>
                    </div>
                  )}
                </div>
                <Button variant="ghost" size="icon" className="mt-7" onClick={() => removeField(field.id)}>
                  <Trash2 className="h-5 w-5 text-destructive" />
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t pt-6 flex items-center justify-center gap-4">
            {fieldTypes.map((type) => (
              <Button key={type.value} variant="secondary" onClick={() => addField(type.value)}>
                <Plus className="h-5 w-5 mr-2" /> Add {type.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="mt-12 flex justify-end">
          <Button size="lg" onClick={handleSave} loading={isSaving}>Save Form</Button>
        </div>
      </div>
    </div>
  );
}
