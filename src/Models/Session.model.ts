/**
 * @fileoverview Mongoose schema and model definition for Sessions.
 * @description
 * Defines the `Session` schema and model, representing user authentication sessions.
 * Manages JWT refresh tokens and session lifecycle for security.
 *
 * @module models/Session
 */
import { Model, model, Schema, Document } from 'mongoose';

/**
 * Interface for Session document.
 */
export interface ISession extends Document {
  /** Unique identifier for the session */
  _id: string;
  /** Reference to the user this session belongs to */
  userId: string;
  /** Refresh token for generating new access tokens */
  refreshToken: string;
  /** User agent string from the client */
  userAgent?: string;
  /** IP address of the client */
  ipAddress?: string;
  /** When the session expires */
  expiresAt: Date;
  /** Whether the session is still valid */
  isValid: boolean;
  /** Timestamps */
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Session Schema.
 *
 * Represents the structure of the `Session` collection in MongoDB.
 * Manages user authentication sessions with refresh tokens.
 */
const SessionSchema = new Schema<ISession>(
  {
    userId: {
      type: String,
      required: true,
      ref: 'User',
    },

    refreshToken: {
      type: String,
      required: true,
      unique: true,
    },

    userAgent: {
      type: String,
      maxlength: 500,
    },

    ipAddress: {
      type: String,
      maxlength: 45, // IPv6 max length
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    isValid: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

/**
 * Session Model.
 *
 * The compiled Mongoose model for Sessions based on the schema.
 */
const SessionModel: Model<ISession> = model<ISession>('Session', SessionSchema);

export default SessionModel;
