/**
 * @fileoverview Mongoose schema and model definition for Water Usage.
 * @description
 * Defines the `WaterUsage` schema and model, representing water consumption records
 * for irrigation zones over time periods.
 *
 * @module models/WaterUsage
 */
import { Model, model, Schema, Document } from "mongoose";

/**
 * Interface for WaterUsage document.
 */
export interface IWaterUsage extends Document {
  /** Unique identifier for the water usage record */
  _id: string;
  /** Reference to the zone this usage applies to */
  zoneId: string;
  /** Start date and time of the usage period */
  startDate: Date;
  /** End date and time of the usage period */
  endDate: Date;
  /** Total water used in liters */
  waterUsedLiters: number;
  /** Duration of irrigation in minutes */
  durationMinutes: number;
  /** Average flow rate during the period */
  averageFlowRate: number;
  /** Weather conditions during the irrigation */
  weatherConditions?: {
    temperature?: number;
    humidity?: number;
    windSpeed?: number;
    precipitation?: number;
  };
  /** Timestamps */
  createdAt: Date;
  updatedAt: Date;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     WaterUsage:
 *       type: object
 *       required:
 *         - zoneId
 *         - startDate
 *         - endDate
 *         - waterUsedLiters
 *         - durationMinutes
 *         - averageFlowRate
 *       properties:
 *         id:
 *           type: string
 *         zoneId:
 *           type: string
 *         startDate:
 *           type: string
 *           format: date-time
 *         endDate:
 *           type: string
 *           format: date-time
 *         waterUsedLiters:
 *           type: number
 *         durationMinutes:
 *           type: number
 *         averageFlowRate:
 *           type: number
 *         weatherConditions:
 *           type: object
 *           properties:
 *             temperature:
 *               type: number
 *             humidity:
 *               type: number
 *             windSpeed:
 *               type: number
 *             precipitation:
 *               type: number
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
const WaterUsageSchema = new Schema<IWaterUsage>(
  {
    zoneId: {
      type: String,
      required: true,
      ref: "Zone",
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    waterUsedLiters: {
      type: Number,
      required: true,
      min: 0,
    },

    durationMinutes: {
      type: Number,
      required: true,
      min: 0,
    },

    averageFlowRate: {
      type: Number,
      required: true,
      min: 0,
    },

    weatherConditions: {
      temperature: {
        type: Number,
        min: -50,
        max: 60,
      },
      humidity: {
        type: Number,
        min: 0,
        max: 100,
      },
      windSpeed: {
        type: Number,
        min: 0,
        max: 100,
      },
      precipitation: {
        type: Number,
        min: 0,
      },
    },
  },
  {
    timestamps: true,
  },
);

/**
 * WaterUsage Model.
 *
 * The compiled Mongoose model for WaterUsage based on the schema.
 */
const WaterUsageModel: Model<IWaterUsage> = model<IWaterUsage>(
  "WaterUsage",
  WaterUsageSchema,
);

export default WaterUsageModel;
