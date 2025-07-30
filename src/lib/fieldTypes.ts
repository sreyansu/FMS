import { FieldType } from '../components/FormBuilder';

export const fieldTypes: { value: FieldType; label: string }[] = [
  { value: 'text', label: 'Text Input' },
  { value: 'textarea', label: 'Text Area' },
  { value: 'rating', label: 'Star Rating' },
  { value: 'radio', label: 'Multiple Choice' },
  { value: 'checkbox', label: 'Checkboxes' },
  { value: 'dropdown', label: 'Dropdown' },
  { value: 'date', label: 'Date Picker' },
  { value: 'file', label: 'File Upload' },
];
