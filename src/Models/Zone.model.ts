/**
 * @fileoverview Mongoose schema and model definition for Zones.
 * @description
 * Defines the `Zone` schema and model, representing irrigation zones in the system.
 * Each zone is associated with a pump and has specific characteristics for irrigation.
 *
 * @module models/Zone
 */
import { Model, model, Schema, Document } from "mongoose";

/**
 * Interface for coordinate points.
 */
export interface ICoordinate {
  latitude: number;
  longitude: number;
}

/**
 * Interface for Zone document.
 */
export interface IZone extends Document {
  /** Unique identifier for the zone */
  _id: string;
  /** Human-readable name for the zone */
  name: string;
  /** Reference to the pump that supplies this zone */
  pumpId: string;
  /** Current operational status */
  status: "active" | "inactive" | "maintenance";
  /** Area of the zone in square meters */
  area: number;
  /** Type of vegetation in the zone */
  vegetationType: string;
  /** Soil type for irrigation calculations */
  soilType: string;
  /** Geographic coordinates defining the zone boundary */
  coordinates: ICoordinate[];
  /** Date when zone was last watered */
  lastWatered?: Date;
  /** Timestamps */
  createdAt: Date;
  updatedAt: Date;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Zone:
 *       type: object
 *       required:
 *         - name
 *         - pumpId
 *         - status
 *         - area
 *         - vegetationType
 *         - soilType
 *         - coordinates
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         pumpId:
 *           type: string
 *         status:
 *           type: string
 *           enum: [active, inactive, maintenance]
 *         area:
 *           type: number
 *         vegetationType:
 *           type: string
 *           enum: [grass, trees, shrubs, flowers, crops, mixed]
 *         soilType:
 *           type: string
 *           enum: [clay, sandy, loam, silt, peat]
 *         coordinates:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *         lastWatered:
 *           type: string
 *           format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
const ZoneSchema = new Schema<IZone>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    pumpId: {
      type: String,
      required: true,
      ref: "Pump",
    },

    status: {
      type: String,
      required: true,
      enum: ["active", "inactive", "maintenance"],
      default: "active",
    },

    area: {
      type: Number,
      required: true,
      min: 0,
      max: 1000000, // Maximum 1,000,000 square meters (100 hectares)
    },

    vegetationType: {
      type: String,
      required: true,
      enum: ["grass", "trees", "shrubs", "flowers", "crops", "mixed"],
    },

    soilType: {
      type: String,
      required: true,
      enum: ["clay", "sandy", "loam", "silt", "peat"],
    },

    coordinates: {
      type: [
        {
          latitude: {
            type: Number,
            required: true,
            min: -90,
            max: 90,
          },
          longitude: {
            type: Number,
            required: true,
            min: -180,
            max: 180,
          },
        },
      ],
      required: true,
      validate: {
        validator: function (coordinates: any[]) {
          return coordinates && coordinates.length > 0;
        },
        message: "Coordinates array cannot be empty",
      },
    },

    lastWatered: Date,
  },
  {
    timestamps: true,
  },
);

/**
 * Zone Model.
 *
 * The compiled Mongoose model for Zones based on the schema.
 */
const ZoneModel: Model<IZone> = model<IZone>("Zone", ZoneSchema);

export default ZoneModel;
