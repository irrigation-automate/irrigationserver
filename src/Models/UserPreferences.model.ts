/**
 * @fileoverview Mongoose schema and model definition for User Preferences.
 * @description
 * Defines the `UserPreferences` schema and model, representing user-specific
 * settings and preferences for the irrigation system interface and notifications.
 *
 * @module models/UserPreferences
 */
import { Model, model, Schema, Document } from 'mongoose';

/**
 * Interface for UserPreferences document.
 */
export interface IUserPreferences extends Document {
  /** Unique identifier for the preferences record */
  _id: string;
  /** Reference to the user these preferences belong to */
  userId: string;
  /** Language preference for the interface */
  language: string;
  /** Timezone for scheduling and notifications */
  timezone: string;
  /** Email notification preferences */
  emailNotifications: {
    enabled: boolean;
    scheduleUpdates: boolean;
    systemAlerts: boolean;
    maintenanceReminders: boolean;
    weeklyReports: boolean;
  };
  /** Push notification preferences */
  pushNotifications: {
    enabled: boolean;
    scheduleUpdates: boolean;
    systemAlerts: boolean;
    maintenanceReminders: boolean;
  };
  /** Dashboard preferences */
  dashboard: {
    defaultView: 'overview' | 'zones' | 'pumps' | 'schedules';
    refreshInterval: number; // in seconds
    showWeather: boolean;
    showWaterUsage: boolean;
  };
  /** Timestamps */
  createdAt: Date;
  updatedAt: Date;
}

/**
 * UserPreferences Schema.
 *
 * Represents the structure of the `UserPreferences` collection in MongoDB.
 * Stores user-specific settings for interface customization and notifications.
 */
const UserPreferencesSchema = new Schema<IUserPreferences>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      ref: 'User',
    },

    language: {
      type: String,
      required: true,
      default: 'en',
      enum: ['en', 'es', 'fr', 'de', 'it', 'pt'],
    },

    timezone: {
      type: String,
      required: true,
      default: 'UTC',
    },

    emailNotifications: {
      enabled: {
        type: Boolean,
        required: true,
        default: true,
      },
      scheduleUpdates: {
        type: Boolean,
        required: true,
        default: true,
      },
      systemAlerts: {
        type: Boolean,
        required: true,
        default: true,
      },
      maintenanceReminders: {
        type: Boolean,
        required: true,
        default: true,
      },
      weeklyReports: {
        type: Boolean,
        required: true,
        default: false,
      },
    },

    pushNotifications: {
      enabled: {
        type: Boolean,
        required: true,
        default: true,
      },
      scheduleUpdates: {
        type: Boolean,
        required: true,
        default: true,
      },
      systemAlerts: {
        type: Boolean,
        required: true,
        default: true,
      },
      maintenanceReminders: {
        type: Boolean,
        required: true,
        default: true,
      },
    },

    dashboard: {
      defaultView: {
        type: String,
        required: true,
        enum: ['overview', 'zones', 'pumps', 'schedules'],
        default: 'overview',
      },
      refreshInterval: {
        type: Number,
        required: true,
        min: 30,
        max: 300, // 30 seconds to 5 minutes
        default: 60,
      },
      showWeather: {
        type: Boolean,
        required: true,
        default: true,
      },
      showWaterUsage: {
        type: Boolean,
        required: true,
        default: true,
      },
    },
  },
  {
    timestamps: true,
  },
);

/**
 * UserPreferences Model.
 *
 * The compiled Mongoose model for UserPreferences based on the schema.
 */
const UserPreferencesModel: Model<IUserPreferences> = model<IUserPreferences>(
  'UserPreferences',
  UserPreferencesSchema,
);

export default UserPreferencesModel;
