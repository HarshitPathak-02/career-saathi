import { Schema, model, Document, Types } from 'mongoose';

export interface INotification extends Document {
  userId: Types.ObjectId;
  title: string;
  body: string;
  type: 'STUDY_REMINDER' | 'STREAK_ALERT' | 'INTERVIEW_FEEDBACK' | 'GENERAL';
  read: boolean;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    type: {
      type: String,
      enum: ['STUDY_REMINDER', 'STREAK_ALERT', 'INTERVIEW_FEEDBACK', 'GENERAL'],
      default: 'GENERAL',
    },
    read: { type: Boolean, default: false },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export const NotificationModel = model<INotification>('Notification', notificationSchema);
