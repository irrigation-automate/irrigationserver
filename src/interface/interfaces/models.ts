import { Document, Schema } from "mongoose";
import { UserRole } from "./enum";

/**
 * Contact information for a user.
 */
export interface IUserContactSchema extends Document {
  /**
   * Unique identifier for the contact document.
   */
  _id: string;

  /**
   * Email address of the user.
   * @example "user@example.com"
   */
  email: string;

  /**
   * First name of the user.
   * @example "John"
   */
  firstName: string;

  /**
   * Last name of the user.
   * @example "Doe"
   */
  lastName: string;

  /**
   * Date when the contact record was last updated.
   */
  last_update: Date;
}

/**
 * Address information for a user.
 */
export interface IUserAddressSchema extends Document {
  /**
   * Unique identifier for the address document.
   */
  _id: string;

  /**
   * City of residence.
   * @example "Tunis"
   */
  city: string;

  /**
   * Street address.
   * @example "123 Main Street"
   */
  street: string;

  /**
   * Country of residence.
   * @example "Tunisia"
   */
  country: string;

  /**
   * Postal or ZIP code.
   * @example 1001
   */
  codeZip: number;

  /**
   * Date when the address record was last updated.
   */
  last_update: Date;
}

/**
 * Password record for a user.
 */
export interface IUserPasswordSchema extends Document {
  /**
   * Unique identifier for the password document.
   */
  _id: string;

  /**
   * Encrypted or hashed password string.
   */
  password: string;

  /**
   * Date when the password was last updated.
   */
  last_update: Date;
}

/**
 * Main user schema that aggregates contact, address, password,
 * and related application-specific references.
 */
export interface IUserSchema extends Document {
  /**
   * Unique identifier for the user document.
   */
  _id: string;

  /**
   * User Role (e.g., admin, user, guest).
   */
  role: UserRole;

  /**
   * Reference to the user address document (optional).
   */
  address?: Schema.Types.ObjectId | IUserAddressSchema["_id"];

  /**
   * Indicates whether the user is blocked from the system.
   * @default false
   */
  blocked: boolean;

  /**
   * Reference to the user contact document.
   */
  contact: Schema.Types.ObjectId | IUserContactSchema["_id"];

  /**
   * Date when the user account was created.
   */
  creation_date: Date;

  /**
   * Reference to the user password document.
   */
  password: Schema.Types.ObjectId | IUserPasswordSchema["_id"];

  /**
   * Reference to the user weather preferences (if configured).
   */
  weather?: Schema.Types.ObjectId | string;

  /**
   * Reference to the user regulation settings (if configured).
   */
  reglage?: Schema.Types.ObjectId | string;

  /**
   * Generates a signed JWT authentication token for the user.
   * @returns {string | null} The JWT token or null if generation fails.
   */
  generateAuthToken: () => string | null;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     UserContact:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         last_update:
 *           type: string
 *           format: date-time
 *     UserAddress:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         city:
 *           type: string
 *         street:
 *           type: string
 *         country:
 *           type: string
 *         codeZip:
 *           type: number
 *         last_update:
 *           type: string
 *           format: date-time
 *     Password:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         password:
 *           type: string
 *         last_update:
 *           type: string
 *           format: date-time
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         role:
 *           $ref: '#/components/schemas/UserRole'
 *         address:
 *           type: string
 *         blocked:
 *           type: boolean
 *         contact:
 *           type: string
 *         creation_date:
 *           type: string
 *           format: date-time
 *         password:
 *           type: string
 *         weather:
 *           type: string
 *         reglage:
 *           type: string
 */
