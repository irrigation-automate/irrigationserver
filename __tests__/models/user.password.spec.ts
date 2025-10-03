import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import bcrypt from 'bcryptjs';
import UserPassword from '../../src/Models/user/user.password';
import { IUserPasswordSchema } from '../../src/interface/interfaces/models';

/**
 * __UserPassword Model Unit Tests
 * Acceptance case (scenario)
 * - Create user passwords with valid data
 * - Ensure passwords are hashed securely before persistence
 * - Validate required field constraints (password is mandatory)
 * - Verify default timestamp assignment for last_update
 * - Confirm password updates trigger hashing and timestamp refresh
 * - Ensure password is not re-hashed unnecessarily when unmodified
 * - Test data integrity and persistence in MongoDB
 */
describe('UserPassword Model', () => {
  let mongoServer: MongoMemoryServer;

  const validPassword: Partial<IUserPasswordSchema> = {
    password: 'Test@1234',
  };

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  afterEach(async () => {
    await UserPassword.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  /**
   * __Valid User Password Creation
   * Acceptance case (scenario)
   * - Create user password with required field
   * - Verify persistence in MongoDB with ObjectId
   * - Ensure password is hashed securely before saving
   * - Confirm last_update timestamp is automatically set
   */
  it('should create and save a user password successfully', async () => {
    const password = new UserPassword(validPassword);
    const savedPassword = await password.save();

    expect(savedPassword._id).toBeDefined();
    expect(savedPassword.password).not.toBe(validPassword.password);
    expect(savedPassword.last_update).toBeDefined();

    const isMatch = await bcrypt.compare(validPassword.password!, savedPassword.password);
    expect(isMatch).toBe(true);
  });

  /**
   * __Required Field Validation
   * Acceptance case (scenario)
   * - Attempt to create user password without password field
   * - Verify validation error is raised
   * - Ensure schema enforces data completeness
   */
  it('should fail when password is not provided', async () => {
    const password = new UserPassword({});

    let error: mongoose.Error.ValidationError | undefined;
    try {
      await password.validate();
    } catch (e) {
      error = e as mongoose.Error.ValidationError;
    }

    expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(error?.errors.password).toBeDefined();
  });

  /**
   * __Password Hashing Before Save
   * Acceptance case (scenario)
   * - Save user password with plaintext value
   * - Verify password is automatically hashed before persistence
   * - Ensure stored value does not equal original plaintext
   */
  it('should hash the password before saving', async () => {
    const password = new UserPassword(validPassword);
    await password.save();

    expect(password.password).not.toBe(validPassword.password);

    const isMatch = await bcrypt.compare(validPassword.password!, password.password);
    expect(isMatch).toBe(true);
  });

  /**
   * __Timestamp Update on Password Change
   * Acceptance case (scenario)
   * - Save initial user password and record last_update
   * - Modify password and save document again
   * - Verify new hash is generated and last_update timestamp increases
   */
  it('should update last_update timestamp on save', async () => {
    const password = new UserPassword(validPassword);
    const savedPassword = await password.save();
    const initialUpdateTime = savedPassword.last_update;

    savedPassword.password = 'NewPassword@123';
    const updatedPassword = await savedPassword.save();

    expect(updatedPassword.password).not.toBe('NewPassword@123');
    expect(updatedPassword.last_update.getTime()).toBeGreaterThan(initialUpdateTime.getTime());
  });

  /**
   * __Avoid Unnecessary Rehashing
   * Acceptance case (scenario)
   * - Save initial user password and record hash
   * - Modify only non-password field and save
   * - Ensure password hash remains unchanged
   */
  it('should not rehash the password if it was not modified', async () => {
    const password = new UserPassword(validPassword);
    const savedPassword = await password.save();
    const initialHash = savedPassword.password;

    savedPassword.markModified('last_update');
    await savedPassword.save();

    expect(savedPassword.password).toBe(initialHash);
  });
});
