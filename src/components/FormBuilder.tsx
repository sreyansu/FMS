'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import FormField from '@/components/FormField';
import { fieldTypes } from '@/lib/fieldTypes';

export type FieldType = 'text' | 'textarea' | 'rating' | 'radio' | 'checkbox' | 'dropdown' | 'date' | 'file';

export interface Field {
  id: number;
  type: FieldType;
  label: string;
  options?: string[];
  placeholder?: string;
  required?: boolean;
}

interface FormBuilderProps {
  existingForm?: any;
  onSave: (formData: any) => void;
}

export default function FormBuilder({ existingForm, onSave }: FormBuilderProps) {
  const [title, setTitle] = useState(existingForm?.title || '');
  const [description, setDescription] = useState(existingForm?.description || '');
  const [fields, setFields] = useState<Field[]>(existingForm?.fields || []);
  const [isSaving, setIsSaving] = useState(false);

  const addField = (type: FieldType) => {
    const newField: Field = {
      id: Date.now(),
      type,
      label: '',
      options: type === 'radio' || type === 'checkbox' || type === 'dropdown' ? [''] : [],
      placeholder: '',
      required: false,
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
    await onSave({ title, description, fields });
    setIsSaving(false);
  };

  return (
    <div>
      <div className="bg-white p-8 rounded-lg shadow space-y-6">
        <Input
          label="Form Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter form title"
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            placeholder="Enter a brief description for the form"
          />
        </div>
      </div>

      <div className="my-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Form Fields</h2>
        <div className="space-y-4">
          {fields.map((field, index) => (
            <FormField
              key={field.id}
              field={field}
              index={index}
              updateField={updateField}
              removeField={removeField}
            />
          ))}
        </div>

        <div className="mt-6 flex items-center gap-4 flex-wrap">
          {fieldTypes.map((type: { value: FieldType; label: string }) => (
            <Button key={type.value} variant="outline" onClick={() => addField(type.value)}>
              <Plus className="h-5 w-5 mr-2" /> Add {type.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button size="lg" onClick={handleSave} loading={isSaving}>
          {existingForm ? 'Save Changes' : 'Create Form'}
        </Button>
      </div>
    </div>
  );
}
