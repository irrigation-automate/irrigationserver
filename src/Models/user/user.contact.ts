/**
 * @fileoverview Mongoose schema and model definition for user contacts.
 * @description
 * Defines the `UserContact` schema and model, which represents user contact
 * information such as email, first name, last name, and last update date.
 *
 * Includes validation for email using a regex pattern from {@link regex.emailValidationRegex}.
 *
 * @module models/UserContact
 */
import { Model, Schema, model } from 'mongoose';
import { regex } from '../../validations/regex';
import { IUserContactSchema } from '../../interface/interfaces/models';

/**
 * User Contact Schema.
 *
 * Represents the structure of the `UserContact` collection in MongoDB.
 * Ensures proper validation and uniqueness of email addresses, as well as required
 * fields for user names.
 *
 * @type {Schema<IUserContactSchema>}
 */
const UserContactSchema: Schema<IUserContactSchema> = new Schema<IUserContactSchema>({
  /**
   * User email address.
   * Must be unique and valid according to {@link regex.emailValidationRegex}.
   *
   * @example
   * "user@example.com"
   */
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: function (v: string): boolean {
        return regex.emailValidationRegex.test(v);
      },
      message: '{VALUE} is not a valid email!',
    },
  },

  /**
   * User's first name.
   *
   * @example
   * "John"
   */
  firstName: {
    type: String,
    required: true,
  },

  /**
   * User's last name.
   *
   * @example
   * "Doe"
   */
  lastName: {
    type: String,
    required: true,
  },

  /**
   * Date when the user’s contact information was last updated.
   * Defaults to the current date/time.
   *
   * @example
   * new Date("2025-10-01T12:00:00Z")
   */
  last_update: {
    type: Date,
    default: Date.now,
  },
});

// Add a pre-save hook to update the last_update field
UserContactSchema.pre('save', function(next) {
  this.last_update = new Date();
  next();
});

/**
 * User Contact Model.
 *
 * The compiled Mongoose model for user contacts based on the schema.
 * Provides CRUD operations on the `UserContact` collection.
 *
 * @example
 * ```ts
 * import UserContact from './models/UserContact';
 *
 * // Create a new contact
 * const contact = new UserContact({
 *   email: "user@example.com",
 *   firstName: "John",
 *   lastName: "Doe",
 * });
 * await contact.save();
 *
 * // Find contact by email
 * const found = await UserContact.findOne({ email: "user@example.com" });
 * ```
 */
const UserContact: Model<IUserContactSchema> = model<IUserContactSchema>(
  'UserContact',
  UserContactSchema
);

export default UserContact;
