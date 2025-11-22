/**
 * @fileoverview Mongoose schema and model definition for Notification Subscribers.
 * @description
 * Defines the `NotificationSubscriber` schema and model, representing user subscriptions
 * to specific notification types and tracking notification delivery status.
 *
 * @module models/NotificationSubscriber
 */

import { Model, model, Schema, Document } from "mongoose";

/**
 * Interface for NotificationSubscriber document.
 */
export interface INotificationSubscriber extends Document {
  /** Unique identifier for the subscription */
  _id: string;
  /** Reference to the notification */
  notificationId: string;
  /** Reference to the user who should receive the notification */
  userId: string;
  /** Subscription channel (email, push, sms, etc.) */
  channel: "email" | "push" | "sms" | "webhook";
  /** Whether the notification was seen by the user */
  seen: boolean;
  /** When the notification was seen (if applicable) */
  seenAt?: Date;
  /** When the notification was sent to this subscriber */
  sentAt?: Date;
  /** Timestamps */
  createdAt: Date;
  updatedAt: Date;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     NotificationSubscriber:
 *       type: object
 *       required:
 *         - notificationId
 *         - userId
 *         - channel
 *       properties:
 *         id:
 *           type: string
 *         notificationId:
 *           type: string
 *         userId:
 *           type: string
 *         channel:
 *           type: string
 *           enum: [email, push, sms, webhook]
 *         seen:
 *           type: boolean
 *         seenAt:
 *           type: string
 *           format: date-time
 *         sentAt:
 *           type: string
 *           format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
const NotificationSubscriberSchema = new Schema<INotificationSubscriber>(
  {
    notificationId: {
      type: String,
      required: true,
      ref: "Notification",
    },

    userId: {
      type: String,
      required: true,
      ref: "User",
    },

    channel: {
      type: String,
      required: true,
      enum: ["email", "push", "sms", "webhook"],
    },

    seen: {
      type: Boolean,
      required: true,
      default: false,
    },

    seenAt: Date,

    sentAt: Date,
  },
  {
    timestamps: true,
  },
);

/**
 * NotificationSubscriber Model.
 *
 * The compiled Mongoose model for NotificationSubscribers based on the schema.
 */
const NotificationSubscriberModel: Model<INotificationSubscriber> =
  model<INotificationSubscriber>(
    "NotificationSubscriber",
    NotificationSubscriberSchema,
  );

export default NotificationSubscriberModel;
