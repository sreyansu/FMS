import mongoose, { Document, Schema } from 'mongoose';

interface IFeedback extends Document {
  name: string;
  email: string;
  rating: number;
  message: string;
  userId?: mongoose.Types.ObjectId;
  status: 'active' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

const FeedbackSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    message: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    status: { type: String, enum: ['active', 'archived'], default: 'active' },
  },
  { timestamps: true }
);

// Indexes for better query performance
FeedbackSchema.index({ email: 1 });
FeedbackSchema.index({ rating: 1 });
FeedbackSchema.index({ createdAt: -1 });
FeedbackSchema.index({ status: 1 });

const Feedback = mongoose.models.Feedback || mongoose.model<IFeedback>('Feedback', FeedbackSchema);

export { IFeedback };
export default Feedback;
