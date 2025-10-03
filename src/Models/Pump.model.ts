/**
 * @fileoverview Mongoose schema and model definition for Pumps.
 * @description
 * Defines the `Pump` schema and model, representing irrigation pumps in the system.
 * Each pump can supply multiple zones and tracks its operational status and health.
 *
 * @module models/Pump
 */
import { Model, model, Schema, Document } from 'mongoose';

/**
 * Interface for Pump document.
 */
export interface IPump extends Document {
  /** Unique identifier for the pump */
  _id: string;
  /** Human-readable name for the pump */
  name: string;
  /** Type of pump (e.g., 'centrifugal', 'submersible') */
  type: string;
  /** Current operational status */
  status: 'active' | 'inactive' | 'maintenance' | 'fault';
  /** Flow rate in liters per minute */
  flowRate: number;
  /** Operating pressure in PSI */
  pressure: number;
  /** Health metrics and diagnostic information */
  health: {
    temperature?: number;
    vibration?: number;
    efficiency?: number;
    lastMaintenance?: Date;
    maintenanceDue?: Date;
  };
  /** Date when pump was last active */
  lastActive?: Date;
  /** Timestamps */
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Pump Schema.
 *
 * Represents the structure of the `Pump` collection in MongoDB.
 * Tracks pump specifications, operational status, and health metrics.
 */
const PumpSchema = new Schema<IPump>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    type: {
      type: String,
      required: true,
      enum: ['centrifugal', 'submersible', 'diaphragm', 'peristaltic'],
    },

    status: {
      type: String,
      required: true,
      enum: ['active', 'inactive', 'maintenance', 'fault'],
      default: 'inactive',
    },

    flowRate: {
      type: Number,
      required: true,
      min: 0,
      max: 10000, // Maximum 10,000 L/min
    },

    pressure: {
      type: Number,
      required: true,
      min: 0,
      max: 200, // Maximum 200 PSI
    },

    health: {
      temperature: {
        type: Number,
        min: 0,
        max: 100,
      },
      vibration: {
        type: Number,
        min: 0,
      },
      efficiency: {
        type: Number,
        min: 0,
        max: 100,
      },
      lastMaintenance: Date,
      maintenanceDue: Date,
    },

    lastActive: Date,
  },
  {
    timestamps: true,
  },
);

/**
 * Pump Model.
 *
 * The compiled Mongoose model for Pumps based on the schema.
 */
const PumpModel: Model<IPump> = model<IPump>('Pump', PumpSchema);

export default PumpModel;
