'use client';

import { GripVertical, Trash2, Plus } from 'lucide-react';
import Button from './ui/Button';
import Input from './ui/Input';
import { Field } from './FormBuilder';

interface FormFieldProps {
  field: Field;
  index: number;
  updateField: (id: number, updatedField: Partial<Field>) => void;
  removeField: (id: number) => void;
}

export default function FormField({ field, index, updateField, removeField }: FormFieldProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow flex items-start gap-4">
      <GripVertical className="h-6 w-6 text-gray-400 mt-2 cursor-move" />
      <div className="flex-grow space-y-4">
        <Input
          label={`Field ${index + 1} Label`}
          value={field.label}
          onChange={(e) => updateField(field.id, { label: e.target.value })}
          placeholder="Enter field label"
        />

        {(field.type === 'text' || field.type === 'textarea') && (
          <Input
            label="Placeholder"
            value={field.placeholder || ''}
            onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
            placeholder="Enter placeholder text"
          />
        )}

        {(field.type === 'radio' || field.type === 'checkbox' || field.type === 'dropdown') && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-600 mb-2">Options</h4>
            {field.options?.map((option, i) => (
              <div key={i} className="flex items-center gap-2 mb-2">
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
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newOptions = (field.options || []).filter((_, idx) => idx !== i);
                    updateField(field.id, { options: newOptions });
                  }}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateField(field.id, { options: [...(field.options || []), ''] })}
            >
              <Plus className="h-4 w-4 mr-2" /> Add Option
            </Button>
          </div>
        )}

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center">
            <input
              id={`required-${field.id}`}
              type="checkbox"
              checked={field.required}
              onChange={(e) => updateField(field.id, { required: e.target.checked })}
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
            />
            <label htmlFor={`required-${field.id}`} className="ml-2 block text-sm text-gray-900">
              Required
            </label>
          </div>
          <Button variant="outline" size="sm" onClick={() => removeField(field.id)}>
            <Trash2 className="h-5 w-5 text-red-600" />
          </Button>
        </div>
      </div>
    </div>
  );
}
