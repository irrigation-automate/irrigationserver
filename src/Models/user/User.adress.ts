/**
 * @fileoverview Mongoose schema and model definition for user addresses.
 * @description
 * This module defines the `UserAddress` schema and model used to store user
 * address information such as city, country, street, postal code, and last update date.
 *
 * The schema is based on the {@link IUserAddressSchema} interface for type safety.
 *
 * @module models/UserAddress
 */
import { Model, Schema, model } from 'mongoose';
import { IUserAddressSchema } from '../../interface/interfaces/models';


/**
 * User Address Schema.
 *
 * Represents the structure of the `UserAddress` documents in MongoDB.
 * Provides default values and type definitions for validation and consistency.
 *
 * @type {Schema<IUserAddressSchema>}
 */
const UserAddressSchema: Schema<IUserAddressSchema> = new Schema<IUserAddressSchema>({
  /**
   * City name of the user’s address.
   * @type {string}
   */
  city: {
    type: String,
  },

  /**
   * Country of the user’s address.
   * Defaults to `"Tunisia"`.
   * @type {string}
   */
  country: {
    type: String,
    default: 'Tunisia',
  },

  /**
   * Street name or number of the user’s address.
   * @type {string}
   */
  street: {
    type: String,
  },

  /**
   * ZIP/Postal code of the user’s address.
   * @type {number}
   */
  codeZip: {
    type: Number,
  },

  /**
   * Date when the user’s address was last updated.
   * Defaults to the current date/time.
   * @type {Date}
   */
  last_update: {
    type: Date,
    default: Date.now,
  },
});

// Add a pre-save hook to update the last_update field
UserAddressSchema.pre('save', function(next) {
  this.last_update = new Date();
  next();
});

/**
 * User Address Model.
 *
 * The compiled Mongoose model for user addresses based on the schema.
 * Can be used to create, query, update, and delete `UserAddress` documents.
 *
 * @example
 * ```ts
 * import UserAddress from './models/UserAddress';
 *
 * // Create a new address
 * const address = new UserAddress({
 *   city: "Tunis",
 *   street: "Main Street 123",
 *   codeZip: 1001,
 * });
 * await address.save();
 * ```
 */
const UserAddress: Model<IUserAddressSchema> = model<IUserAddressSchema>(
  'UserAddress',
  UserAddressSchema
);

export default UserAddress;
