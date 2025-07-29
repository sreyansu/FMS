import { Schema, model, models } from 'mongoose';

const FieldSchema = new Schema({
  type: {
    type: String,
    required: true,
    enum: ['text', 'textarea', 'rating', 'radio'],
  },
  label: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    default: undefined,
  },
});

const FormSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  fields: {
    type: [FieldSchema],
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'closed'],
    default: 'active',
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

const Form = models.Form || model('Form', FormSchema);

export default Form;
