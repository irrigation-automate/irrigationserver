/**
 * @fileoverview Mongoose schema and model definition for Users.
 * @description
 * Defines the `User` schema and model, representing application users.
 * Each user references a contact document, password document, and address document.
 * Includes methods for authentication (JWT token generation).
 *
 * @module models/User
 */
import { Model, model, Schema } from 'mongoose';
import jwt from 'jsonwebtoken';
import { enirementVariables } from '../../configs/envirementVariables';
import { IUserSchema } from '../../interface/interfaces/models';
import UserAddress from './User.adress';
import UserContact from './user.contact';
import UserPassword from './user.password';

// Get JWT secret
const getJWTSecret = () => enirementVariables.JWTConfig.JWTSecret;

/**
 * User Schema.
 *
 * Represents the structure of the `User` collection in MongoDB.
 * Each user is linked to address, contact, and password sub-documents.
 *
 * @type {Schema<IUserSchema>}
 */
const UserSchema = new Schema<IUserSchema>({
  /**
   * Reference to the user's address.
   * Each user has a unique address document.
   */
  address: {
    type: Schema.Types.ObjectId,
    ref: UserAddress.modelName,
    required: true,
    unique: true,
  },

  /**
   * Whether the user account is blocked.
   * Defaults to `true` for security until explicitly unblocked.
   *
   * @example false
   */
  blocked: {
    type: Boolean,
    required: true,
    default: true,
  },

  /**
   * Reference to the user's contact information (email, names, etc.).
   */
  contact: {
    type: Schema.Types.ObjectId,
    ref: UserContact.modelName,
    required: true,
  },

  /**
   * Date the user account was created.
   * Automatically set to the current date/time.
   */
  creation_date: {
    type: Date,
    default: Date.now,
  },

  /**
   * Reference to the user's password document.
   * Stores hashed password securely.
   */
  password: {
    type: Schema.Types.ObjectId,
    ref: UserPassword.modelName,
    required: true,
  },

  /**
   * Reference to weather preferences (optional).
   */
  weather: {
    type: Schema.Types.ObjectId,
    ref: 'Weather',
  },

  /**
   * Reference to user settings/reglage (optional).
   */
  reglage: {
    type: Schema.Types.ObjectId,
    ref: 'Reglage',
  },
});

/**
 * Instance method: Generate JWT auth token.
 *
 * Generates a signed JSON Web Token containing the user’s `_id`.
 * Uses the configured secret from environment variables.
 *
 * @function
 * @returns {string | null} Signed JWT token (valid for 10 hours) or `null` if secret is missing.
 *
 * @example
 * const user = await UserModel.findById("123");
 * const token = user.generateAuthToken();
 */
UserSchema.methods.generateAuthToken = function (): string | null {
  const secret = getJWTSecret();
  if (secret) {
    return jwt.sign({ _id: this._id }, secret, { expiresIn: '10h' });
  }
  return null;
};

/**
 * User Model.
 *
 * The compiled Mongoose model for Users based on the schema.
 * Provides CRUD operations and access to custom methods like `generateAuthToken`.
 *
 * @example
 * ```ts
 * import UserModel from './models/User';
 *
 * // Create a new user
 * const newUser = new UserModel({
 *   contact: contactId,
 *   address: addressId,
 *   password: passwordId
 * });
 * await newUser.save();
 *
 * // Generate JWT for authentication
 * const token = newUser.generateAuthToken();
 * ```
 */
const UserModel: Model<IUserSchema> = model<IUserSchema>('User', UserSchema);

export default UserModel;
