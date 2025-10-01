/**
 * @fileoverview Mongoose schema and model definition for user passwords.
 * @description
 * Defines the `Password` schema and model, which is responsible for securely
 * storing user passwords. Includes middleware to automatically hash passwords
 * before saving them to the database using `bcrypt`.
 *
 * @module models/Password
 */
import { Model, model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUserPasswordSchema } from '../../interface/interfaces/models';

/**
 * User Password Schema.
 *
 * Represents the structure of the `Password` collection in MongoDB.
 * Stores a hashed user password and keeps track of the last update timestamp.
 *
 * @type {Schema<IUserPasswordSchema>}
 */
const PasswordSchema: Schema<IUserPasswordSchema> = new Schema<IUserPasswordSchema>({
  /**
   * Hashed user password.
   * This field is required and automatically hashed before saving using bcrypt.
   *
   * @example
   * "$2a$10$E6J7H9KjZ1jPZs9xK7bZbO2KZHg4D1y3YFlRMGN7wJhvZ4YHz8QeK"
   */
  password: {
    type: String,
    required: true,
  },

  /**
   * Date when the password was last updated.
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

/**
 * Mongoose pre-save middleware.
 *
 * Automatically hashes the password field using bcrypt if it has been modified.
 * This ensures that plain-text passwords are never stored in the database.
 *
 * @function
 * @param {Function} next - Callback to proceed with the save operation.
 */
PasswordSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(this.password, salt);
  this.password = hash;

  // Update the last_update timestamp
  this.last_update = new Date();

  next();
});

/**
 * User Password Model.
 *
 * The compiled Mongoose model for user passwords based on the schema.
 * Provides CRUD operations on the `Password` collection.
 *
 * @example
 * ```ts
 * import Password from './models/Password';
 *
 * // Create a new password document
 * const pwd = new Password({ password: "mySecret123" });
 * await pwd.save(); // password will be hashed automatically
 *
 * // Find password record
 * const found = await Password.findById(pwd._id);
 * ```
 */
const Password: Model<IUserPasswordSchema> = model<IUserPasswordSchema>('Password', PasswordSchema);

export default Password;
