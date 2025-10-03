/**
 * @fileoverview Mongoose schema and model definition for Notifications.
 * @description
 * Defines the `Notification` schema and model, representing system notifications.
 * Handles various types of notifications for users about system events and alerts.
 *
 * @module models/Notification
 */
import { Model, model, Schema, Document } from 'mongoose';

/**
 * Interface for Notification document.
 */
export interface INotification extends Document {
  /** Unique identifier for the notification */
  _id: string;
  /** Name of the module that generated the notification */
  moduleName: string;
  /** Action or event that triggered the notification */
  action: string;
  /** Current status of the notification */
  status: 'pending' | 'sent' | 'failed' | 'cancelled';
  /** Notification payload data */
  payload: {
    title: string;
    message: string;
    data?: Record<string, any>;
    priority?: 'low' | 'normal' | 'high' | 'urgent';
    category?: string;
  };
  /** Timestamps */
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Notification Schema.
 *
 * Represents the structure of the `Notification` collection in MongoDB.
 * Stores notifications with their content, status, and metadata.
 */
const NotificationSchema = new Schema<INotification>(
  {
    moduleName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    action: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    status: {
      type: String,
      required: true,
      enum: ['pending', 'sent', 'failed', 'cancelled'],
      default: 'pending',
    },

    payload: {
      title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200,
      },
      message: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000,
      },
      data: {
        type: Schema.Types.Mixed,
        default: {},
      },
      priority: {
        type: String,
        enum: ['low', 'normal', 'high', 'urgent'],
        default: 'normal',
      },
      category: {
        type: String,
        trim: true,
        maxlength: 50,
      },
    },
  },
  {
    timestamps: true,
  },
);

/**
 * Notification Model.
 *
 * The compiled Mongoose model for Notifications based on the schema.
 */
const NotificationModel: Model<INotification> = model<INotification>(
  'Notification',
  NotificationSchema,
);

export default NotificationModel;
