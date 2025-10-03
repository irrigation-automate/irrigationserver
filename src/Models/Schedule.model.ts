/**
 * @fileoverview Mongoose schema and model definition for Schedules.
 * @description
 * Defines the `Schedule` schema and model, representing irrigation schedules in the system.
 * Each schedule defines when and how zones should be irrigated based on various conditions.
 *
 * @module models/Schedule
 */
import { Model, model, Schema, Document } from 'mongoose';

/**
 * Interface for weather conditions.
 */
export interface IWeatherConditions {
  minTemperature?: number;
  maxTemperature?: number;
  maxHumidity?: number;
  maxWindSpeed?: number;
  noRain?: boolean;
}

/**
 * Interface for Schedule document.
 */
export interface ISchedule extends Document {
  /** Unique identifier for the schedule */
  _id: string;
  /** Reference to the zone this schedule applies to */
  zoneId: string;
  /** Type of schedule */
  type: 'interval' | 'calendar' | 'weather' | 'sensor';
  /** Days of week (0-6, Sunday = 0) for calendar schedules */
  days?: number[];
  /** Start time in HH:MM format */
  startTime: string;
  /** Duration in minutes */
  duration: number;
  /** Whether the schedule is enabled */
  enabled: boolean;
  /** Weather conditions for weather-based schedules */
  weatherConditions?: IWeatherConditions;
  /** Sensor thresholds for sensor-based schedules */
  sensorThresholds?: {
    soilMoisture?: number;
    temperature?: number;
  };
  /** Next scheduled run time */
  nextRun?: Date;
  /** Timestamps */
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Schedule Schema.
 *
 * Represents the structure of the `Schedule` collection in MongoDB.
 * Defines irrigation schedules with various trigger conditions and timing.
 */
const ScheduleSchema = new Schema<ISchedule>(
  {
    zoneId: {
      type: String,
      required: true,
      ref: 'Zone',
    },

    type: {
      type: String,
      required: true,
      enum: ['interval', 'calendar', 'weather', 'sensor'],
    },

    days: {
      type: [Number],
      validate: {
        validator: function (days: number[]) {
          if (!days) return true;
          return days.every((day) => day >= 0 && day <= 6);
        },
        message: 'Days must be between 0 (Sunday) and 6 (Saturday)',
      },
    },

    startTime: {
      type: String,
      required: true,
      match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
    },

    duration: {
      type: Number,
      required: true,
      min: 1,
      max: 1440, // Maximum 24 hours
    },

    enabled: {
      type: Boolean,
      required: true,
      default: true,
    },

    weatherConditions: {
      minTemperature: {
        type: Number,
        min: -50,
        max: 60,
      },
      maxTemperature: {
        type: Number,
        min: -50,
        max: 60,
      },
      maxHumidity: {
        type: Number,
        min: 0,
        max: 100,
      },
      maxWindSpeed: {
        type: Number,
        min: 0,
        max: 100,
      },
      noRain: Boolean,
    },

    sensorThresholds: {
      soilMoisture: {
        type: Number,
        min: 0,
        max: 100,
      },
      temperature: {
        type: Number,
        min: -50,
        max: 60,
      },
    },

    nextRun: Date,
  },
  {
    timestamps: true,
  },
);

/**
 * Schedule Model.
 *
 * The compiled Mongoose model for Schedules based on the schema.
 */
const ScheduleModel: Model<ISchedule> = model<ISchedule>('Schedule', ScheduleSchema);

export default ScheduleModel;
